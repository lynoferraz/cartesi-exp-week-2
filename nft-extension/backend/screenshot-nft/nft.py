from pydantic import BaseModel
import logging
from typing import Optional, List
import json
from py_expression_eval import Parser
from enum import Enum

from cartesi.abi import String, Bytes, Bytes32, Int, UInt, Address, encode_model

from cartesapp.storage import helpers
from cartesapp.context import get_metadata
from cartesapp.input import mutation, query
from cartesapp.output import output, add_output, event, emit_event, index_input
from cartesapp.utils import hex2bytes, bytes2str

from core.tape import VerifyPayload
from core.model import Cartridge, TapeHash, Rule
from core.riv import verify_log
from core.core_settings import CoreSettings, generate_tape_id, get_version, generate_entropy, get_cartridges_path

from .common import get_cid, screenshot_add_score

LOGGER = logging.getLogger(__name__)

@event()
class NftOutputExtension(BaseModel):
    tape_hash:              Bytes32
    cid:                    String

@event()
class VerificationOutput(BaseModel):
    version:                Bytes32
    cartridge_id:           Bytes32
    cartridge_input_index:  Int
    cartridge_user_address: Address
    timestamp:              UInt
    score:                  Int
    rule_id:                Bytes32
    rule_input_index:       Int
    tape_hash:              Bytes32
    tape_input_index:       Int
    user_address:           Address
    error_code:             UInt
    nft_output:             Bytes


@mutation(proxy=CoreSettings().proxy_address,module_name='core') # trap core verify
# @mutation()
def verify(payload: VerifyPayload) -> bool:
    metadata = get_metadata()
    print(f"==== DEBUG ==== {metadata=}")

    # get Rule
    rule = Rule.get(lambda r: r.id == payload.rule_id.hex())
    if rule is None:
        msg = f"rule {payload.rule_id.hex()} doesn't exist"
        LOGGER.error(msg)
        add_output(msg)
        return False

    if rule.start is not None and rule.start > 0 and rule.start > metadata.timestamp:
        msg = f"timestamp earlier than rule start"
        LOGGER.error(msg)
        add_output(msg)
        return False

    if rule.end is not None and rule.end > 0 and rule.end < metadata.timestamp:
        msg = f"timestamp later than rule end"
        LOGGER.error(msg)
        add_output(msg)
        return False

    tape_id = generate_tape_id(payload.tape)
    
    if TapeHash.check_duplicate(rule.cartridge_id,tape_id):
        msg = f"Tape already submitted"
        LOGGER.error(msg)
        add_output(msg)
        return False

    cartridge = helpers.select(c for c in Cartridge if c.active and c.id == rule.cartridge_id).first()

    if cartridge is None:
        msg = f"Cartridge not found"
        LOGGER.error(msg)
        add_output(msg)
        return False

    # process tape
    LOGGER.info(f"Verifying tape...")
    try:
        entropy = generate_entropy(metadata.msg_sender, rule.id)

        with open(f"{get_cartridges_path()}/{rule.cartridge_id}",'rb')as cartridge_file:
            cartridge_data = cartridge_file.read()

        ### ADDED option to generate screenshot
        verification_output = verify_log(cartridge_data,payload.tape,rule.args,rule.in_card,entropy=entropy, get_screenshot=True)
        outcard_raw = verification_output.get('outcard')
        outhash = verification_output.get('outhash')
        # screenshot = verification_output.get('screenshot')
    except Exception as e:
        msg = f"Couldn't verify tape: {e}"
        LOGGER.error(msg)
        add_output(msg)
        return False

    # compare outcard
    tape_outcard_hash = payload.outcard_hash 
    if tape_outcard_hash == b'\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0':
        tape_outcard_hash = outhash

    outcard_valid = outhash == tape_outcard_hash

    outcard_format = outcard_raw[:4]

    outcard_print = bytes2str(outcard_raw[4:]) if outcard_format in [b"JSON",b"TEXT"] else outcard_raw[4:]

    LOGGER.debug(f"==== BEGIN OUTCARD ({outcard_format}) ====")
    LOGGER.debug(outcard_print)
    LOGGER.debug("==== END OUTCARD ====")
    LOGGER.debug(f"Expected Outcard Hash: {payload.outcard_hash.hex()}")
    LOGGER.debug(f"Computed Outcard Hash: {outhash.hex()}")
    LOGGER.debug(f"Valid Outcard Hash: {outcard_valid}")

    if not outcard_valid:
        msg = f"Out card hash doesn't match"
        LOGGER.error(msg)
        add_output(msg)
        return False

    score = 0
    if rule.score_function is not None and len(rule.score_function) > 0 and outcard_format == b"JSON":
        try:
            outcard_json = json.loads(outcard_print)
            parser = Parser()
            score = parser.parse(rule.score_function).evaluate(outcard_json)
        except Exception as e:
            msg = f"Couldn't load/parse score from json: {e}"
            LOGGER.error(msg)
            add_output(msg)
            return False

        # compare claimed score
        claimed_score = payload.claimed_score
        if claimed_score == 0:
            claimed_score = score

        score_valid = score == claimed_score

        LOGGER.debug(f"Expected Score: {payload.claimed_score}")
        LOGGER.debug(f"Computed Score: {score}")
        LOGGER.debug(f"Valid Score: {score_valid}")

        if not score_valid:
            msg = f"Score doesn't match"
            LOGGER.error(msg)
            add_output(msg)
            return False

    LOGGER.info(f"Tape verified")


    ### ADDED part to generate cid
    screenshot = verification_output.get('screenshot')
    if len(screenshot) == 0:
        msg = f"Empty Screenshot"
        LOGGER.error(msg)
        add_output(msg)
        return False

    user_alias = f"{metadata.msg_sender[:6]}...{metadata.msg_sender[-4:]}"
    final_screenshot = screenshot_add_score(screenshot,cartridge.name,score,user_alias)

    cid = get_cid(final_screenshot)

    nft_out = NftOutputExtension(
        tape_hash = hex2bytes(tape_id),
        cid = cid
    )

    out_ev = VerificationOutput(
        version=get_version(),
        cartridge_id = hex2bytes(cartridge.id),
        cartridge_input_index = cartridge.input_index,
        cartridge_user_address = cartridge.user_address,
        user_address = metadata.msg_sender,
        timestamp = metadata.timestamp,
        score = score,
        rule_id = hex2bytes(rule.id),
        rule_input_index = rule.input_index,
        tape_hash = hex2bytes(tape_id),
        tape_input_index = metadata.input_index,
        error_code=0,
        nft_output= encode_model(nft_out)
    )
    common_tags = [rule.cartridge_id,payload.rule_id.hex(),tape_id]
    common_tags.extend(list(rule.tags.name.distinct().keys()))
    screenshot_tags = ["screenshot"]
    screenshot_tags.extend(common_tags)
    add_output(final_screenshot,tags=screenshot_tags,value=score)
    event_tags = ["score"]
    event_tags.extend(common_tags)
    emit_event(out_ev,tags=event_tags,value=score)

    TapeHash.set_verified(rule.cartridge_id,rule.id,tape_id)

    return True
