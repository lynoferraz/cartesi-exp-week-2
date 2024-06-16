import os
from hashlib import sha256
import json

from cartesapp.storage import Storage
from cartesapp.utils import hex2bytes, str2bytes

###
# Settings

class CoreSettings:
    def __new__(cls):
        cls.cartridges_path = "cartridges"
        cls.scoreboard_ttl = 7776000 # 90 days
        cls.test_tape_path = 'misc/test.rivlog'
        cls.version = os.getenv('RIVES_VERSION') or '0'
        cls.rivemu_path = os.getenv('RIVEMU_PATH')
        cls.operator_address = os.getenv('OPERATOR_ADDRESS') or "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        cls.proxy_address = os.getenv('PROXY_ADDRESS') or "0x0b3940925df62Abe67fe9fC9cCDe949a29408C2b"
        cls.genesis_cartridges = list(map(lambda s: s.strip(), os.getenv('GENESIS_CARTRIDGES').split(','))) \
            if os.getenv('GENESIS_CARTRIDGES') is not None else \
                ['snake']
        cls.genesis_rules = json.loads(os.getenv('GENESIS_RULES')) \
            if os.getenv('GENESIS_RULES') is not None else \
                {"snake":{"name":"Apples!","description":"Eat apples","score_function":"apples*1000-floor(frames/5)","start":1717988400,"end":1719716400}}
        return cls
    

###
# Helpers

def get_version() -> bytes:
    version = str2bytes(CoreSettings().version)
    if len(version) > 32: version = version[-32:]
    return b'\0'*(32-len(version)) + version

def get_cartridges_path() -> str:
    return f"{Storage.STORAGE_PATH or '.'}/{CoreSettings().cartridges_path}"

def generate_cartridge_id(bin_data: bytes) -> str:
    return sha256(bin_data).hexdigest()

def generate_tape_id(bin_data: bytes) -> str:
    return sha256(bin_data).hexdigest()

def is_inside_cm() -> bool:
    uname = os.uname()
    return 'ctsi' in uname.release and uname.machine == 'riscv64'

def get_cartridge_tapes_filename() -> str:
    return f"{Storage.STORAGE_PATH}/cartridge_tapes.pkl"

def generate_rule_id(cartridge_id: bytes,bytes_name: bytes) -> str:
    return sha256(cartridge_id + bytes_name).hexdigest()

def generate_entropy(user_address: str, rule_id: str) -> str:
    return sha256(hex2bytes(user_address) + hex2bytes(rule_id)).hexdigest()

def generate_rule_parameters_tag(args: str, in_card: bytes, score_function: str) -> str:
    return sha256(str2bytes(args) + in_card + str2bytes(score_function)).hexdigest()