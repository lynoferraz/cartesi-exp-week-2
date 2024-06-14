/* eslint-disable */
/**
 * This file was automatically generated by cartesapp.template_generator.
 * DO NOT MODIFY IT BY HAND. Instead, run the generator,
 */
import { ethers, Signer, ContractReceipt } from "ethers";

import { 
    advanceInput, inspect, 
    AdvanceOutput, InspectOptions, AdvanceInputOptions, GraphqlOptions,
    EtherDepositOptions, ERC20DepositOptions, ERC721DepositOptions,
    Report as CartesiReport, Notice as CartesiNotice, Voucher as CartesiVoucher, Input as CartesiInput,
    advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit,
    queryNotice, queryReport, queryVoucher
} from "cartesi-client";


import Ajv from "ajv"
import addFormats from "ajv-formats"

import { 
    genericAdvanceInput, genericInspect, IOType, Models,
    IOData, Input, Output, Event, ContractCall, InspectReport, 
    MutationOptions, QueryOptions, 
    CONVENTIONAL_TYPES, decodeToConventionalTypes
} from "../cartesapp/utils"

import { 
    genericGetOutputs, decodeAdvance, DecodedIndexerOutput
} from "../cartesapp/lib"

import * as indexerIfaces from "../indexer/ifaces"
import * as ifaces from "./ifaces";


/**
 * Configs
 */

const ajv = new Ajv();
addFormats(ajv);
ajv.addFormat("biginteger", (data) => {
    const dataTovalidate = data.startsWith('-') ? data.substring(1) : data;
    return ethers.utils.isHexString(dataTovalidate) && dataTovalidate.length % 2 == 0;
});
const MAX_SPLITTABLE_OUTPUT_SIZE = 4194247;

/*
 * Mutations/Advances
 */

export async function insertCartridge(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.InsertCartridgePayload,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: InsertCartridgePayload = new InsertCartridgePayload(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.InsertCartridgePayload>(client,dappAddress,'0x5eab7461',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}

export async function removeCartridge(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.RemoveCartridgePayload,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: RemoveCartridgePayload = new RemoveCartridgePayload(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.RemoveCartridgePayload>(client,dappAddress,'0x436046ac',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}

export async function createRule(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.RuleData,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: RuleData = new RuleData(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.RuleData>(client,dappAddress,'0x3391d491',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}

export async function verify(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.VerifyPayload,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: VerifyPayload = new VerifyPayload(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.VerifyPayload>(client,dappAddress,'0x0a5441f8',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}

export async function registerExternalVerification(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.VerifyPayload,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: VerifyPayload = new VerifyPayload(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.VerifyPayload>(client,dappAddress,'0x0ccb5a1d',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}

export async function externalVerification(
    client:Signer,
    dappAddress:string,
    inputData: ifaces.ExternalVerificationPayload,
    options?:MutationOptions
):Promise<AdvanceOutput|ContractReceipt|any[]> {
    const data: ExternalVerificationPayload = new ExternalVerificationPayload(inputData);
    if (options?.decode) { options.sync = true; }
    const result = await genericAdvanceInput<ifaces.ExternalVerificationPayload>(client,dappAddress,'0x92c0788f',data, options)
    if (options?.decode) {
        return decodeAdvance(result as AdvanceOutput,decodeToModel,options);
    }
    return result;
}


/*
 * Queries/Inspects
 */

export async function cartridge(
    inputData: ifaces.CartridgePayloadSplittable,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/cartridge';
    let part:number = 0;
    let hasMoreParts:boolean = false;
    const output: InspectReport = {payload: "0x"}
    do {
        hasMoreParts = false;
        let inputDataSplittable = Object.assign({part},inputData);
        const data: CartridgePayloadSplittable = new CartridgePayloadSplittable(inputDataSplittable);
        const partOutput: InspectReport = await genericInspect<ifaces.CartridgePayloadSplittable>(data,route,options);
        let payloadHex = partOutput.payload.substring(2);
        if (payloadHex.length/2 > MAX_SPLITTABLE_OUTPUT_SIZE) {
            part++;
            payloadHex = payloadHex.substring(0, payloadHex.length - 2);
            hasMoreParts = true;
        }
        output.payload += payloadHex;
    } while (hasMoreParts)
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}

export async function cartridgeInfo(
    inputData: ifaces.CartridgePayload,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/cartridge_info';
    const data: CartridgePayload = new CartridgePayload(inputData);
    const output: InspectReport = await genericInspect<ifaces.CartridgePayload>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}

export async function cartridges(
    inputData: ifaces.CartridgesPayload,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/cartridges';
    const data: CartridgesPayload = new CartridgesPayload(inputData);
    const output: InspectReport = await genericInspect<ifaces.CartridgesPayload>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}

export async function rules(
    inputData: ifaces.GetRulesPayload,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/rules';
    const data: GetRulesPayload = new GetRulesPayload(inputData);
    const output: InspectReport = await genericInspect<ifaces.GetRulesPayload>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}

export async function ruleTags(
    inputData: ifaces.GetRuleTagsPayload,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/rule_tags';
    const data: GetRuleTagsPayload = new GetRuleTagsPayload(inputData);
    const output: InspectReport = await genericInspect<ifaces.GetRuleTagsPayload>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}

export async function operatorAddress(
    inputData: ifaces.EmptyClass,
    options?:QueryOptions
):Promise<InspectReport|any> {
    const route = 'core/operator_address';
    const data: EmptyClass = new EmptyClass(inputData);
    const output: InspectReport = await genericInspect<ifaces.EmptyClass>(data,route,options);
    if (options?.decode) { return decodeToModel(output,options.decodeModel || "json"); }
    return output;
}


/*
 * Indexer Query
 */

export async function getOutputs(
    inputData: indexerIfaces.IndexerPayload,
    options?:InspectOptions
):Promise<DecodedIndexerOutput> {
    return genericGetOutputs(inputData,decodeToModel,options);
}


/**
 * Models Decoders/Exporters
 */

export function decodeToModel(data: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput, modelName: string): any {
    if (modelName == undefined)
        throw new Error("undefined model");
    if (CONVENTIONAL_TYPES.includes(modelName))
        return decodeToConventionalTypes(data.payload,modelName);
    const decoder = models[modelName].decoder;
    if (decoder == undefined)
        throw new Error("undefined decoder");
    return decoder(data);
}

export function exportToModel(data: any, modelName: string): string {
    const exporter = models[modelName].exporter;
    if (exporter == undefined)
        throw new Error("undefined exporter");
    return exporter(data);
}

export class InsertCartridgePayloadInput extends Input<ifaces.InsertCartridgePayload> { constructor(data: CartesiInput) { super(models['InsertCartridgePayload'],data); } }
export function decodeToInsertCartridgePayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): InsertCartridgePayloadInput {
    return new InsertCartridgePayloadInput(output as CartesiInput);
}

export class InsertCartridgePayload extends IOData<ifaces.InsertCartridgePayload> { constructor(data: ifaces.InsertCartridgePayload, validate: boolean = true) { super(models['InsertCartridgePayload'],data,validate); } }
export function exportToInsertCartridgePayload(data: ifaces.InsertCartridgePayload): string {
    const dataToExport: InsertCartridgePayload = new InsertCartridgePayload(data);
    return dataToExport.export();
}
export class VerifyPayloadInput extends Input<ifaces.VerifyPayload> { constructor(data: CartesiInput) { super(models['VerifyPayload'],data); } }
export function decodeToVerifyPayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): VerifyPayloadInput {
    return new VerifyPayloadInput(output as CartesiInput);
}

export class VerifyPayload extends IOData<ifaces.VerifyPayload> { constructor(data: ifaces.VerifyPayload, validate: boolean = true) { super(models['VerifyPayload'],data,validate); } }
export function exportToVerifyPayload(data: ifaces.VerifyPayload): string {
    const dataToExport: VerifyPayload = new VerifyPayload(data);
    return dataToExport.export();
}
export class RemoveCartridgePayloadInput extends Input<ifaces.RemoveCartridgePayload> { constructor(data: CartesiInput) { super(models['RemoveCartridgePayload'],data); } }
export function decodeToRemoveCartridgePayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): RemoveCartridgePayloadInput {
    return new RemoveCartridgePayloadInput(output as CartesiInput);
}

export class RemoveCartridgePayload extends IOData<ifaces.RemoveCartridgePayload> { constructor(data: ifaces.RemoveCartridgePayload, validate: boolean = true) { super(models['RemoveCartridgePayload'],data,validate); } }
export function exportToRemoveCartridgePayload(data: ifaces.RemoveCartridgePayload): string {
    const dataToExport: RemoveCartridgePayload = new RemoveCartridgePayload(data);
    return dataToExport.export();
}
export class RuleDataInput extends Input<ifaces.RuleData> { constructor(data: CartesiInput) { super(models['RuleData'],data); } }
export function decodeToRuleDataInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): RuleDataInput {
    return new RuleDataInput(output as CartesiInput);
}

export class RuleData extends IOData<ifaces.RuleData> { constructor(data: ifaces.RuleData, validate: boolean = true) { super(models['RuleData'],data,validate); } }
export function exportToRuleData(data: ifaces.RuleData): string {
    const dataToExport: RuleData = new RuleData(data);
    return dataToExport.export();
}
export class ExternalVerificationPayloadInput extends Input<ifaces.ExternalVerificationPayload> { constructor(data: CartesiInput) { super(models['ExternalVerificationPayload'],data); } }
export function decodeToExternalVerificationPayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): ExternalVerificationPayloadInput {
    return new ExternalVerificationPayloadInput(output as CartesiInput);
}

export class ExternalVerificationPayload extends IOData<ifaces.ExternalVerificationPayload> { constructor(data: ifaces.ExternalVerificationPayload, validate: boolean = true) { super(models['ExternalVerificationPayload'],data,validate); } }
export function exportToExternalVerificationPayload(data: ifaces.ExternalVerificationPayload): string {
    const dataToExport: ExternalVerificationPayload = new ExternalVerificationPayload(data);
    return dataToExport.export();
}
export class CartridgePayloadInput extends Input<ifaces.CartridgePayload> { constructor(data: CartesiInput) { super(models['CartridgePayload'],data); } }
export function decodeToCartridgePayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgePayloadInput {
    return new CartridgePayloadInput(output as CartesiInput);
}

export class CartridgePayload extends IOData<ifaces.CartridgePayload> { constructor(data: ifaces.CartridgePayload, validate: boolean = true) { super(models['CartridgePayload'],data,validate); } }
export function exportToCartridgePayload(data: ifaces.CartridgePayload): string {
    const dataToExport: CartridgePayload = new CartridgePayload(data);
    return dataToExport.export();
}
export class CartridgePayloadSplittableInput extends Input<ifaces.CartridgePayloadSplittable> { constructor(data: CartesiInput) { super(models['CartridgePayloadSplittable'],data); } }
export function decodeToCartridgePayloadSplittableInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgePayloadSplittableInput {
    return new CartridgePayloadSplittableInput(output as CartesiInput);
}

export class CartridgePayloadSplittable extends IOData<ifaces.CartridgePayloadSplittable> { constructor(data: ifaces.CartridgePayloadSplittable, validate: boolean = true) { super(models['CartridgePayloadSplittable'],data,validate); } }
export function exportToCartridgePayloadSplittable(data: ifaces.CartridgePayloadSplittable): string {
    const dataToExport: CartridgePayloadSplittable = new CartridgePayloadSplittable(data);
    return dataToExport.export();
}
export class GetRuleTagsPayloadInput extends Input<ifaces.GetRuleTagsPayload> { constructor(data: CartesiInput) { super(models['GetRuleTagsPayload'],data); } }
export function decodeToGetRuleTagsPayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): GetRuleTagsPayloadInput {
    return new GetRuleTagsPayloadInput(output as CartesiInput);
}

export class GetRuleTagsPayload extends IOData<ifaces.GetRuleTagsPayload> { constructor(data: ifaces.GetRuleTagsPayload, validate: boolean = true) { super(models['GetRuleTagsPayload'],data,validate); } }
export function exportToGetRuleTagsPayload(data: ifaces.GetRuleTagsPayload): string {
    const dataToExport: GetRuleTagsPayload = new GetRuleTagsPayload(data);
    return dataToExport.export();
}
export class GetRulesPayloadInput extends Input<ifaces.GetRulesPayload> { constructor(data: CartesiInput) { super(models['GetRulesPayload'],data); } }
export function decodeToGetRulesPayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): GetRulesPayloadInput {
    return new GetRulesPayloadInput(output as CartesiInput);
}

export class GetRulesPayload extends IOData<ifaces.GetRulesPayload> { constructor(data: ifaces.GetRulesPayload, validate: boolean = true) { super(models['GetRulesPayload'],data,validate); } }
export function exportToGetRulesPayload(data: ifaces.GetRulesPayload): string {
    const dataToExport: GetRulesPayload = new GetRulesPayload(data);
    return dataToExport.export();
}
export class CartridgesPayloadInput extends Input<ifaces.CartridgesPayload> { constructor(data: CartesiInput) { super(models['CartridgesPayload'],data); } }
export function decodeToCartridgesPayloadInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgesPayloadInput {
    return new CartridgesPayloadInput(output as CartesiInput);
}

export class CartridgesPayload extends IOData<ifaces.CartridgesPayload> { constructor(data: ifaces.CartridgesPayload, validate: boolean = true) { super(models['CartridgesPayload'],data,validate); } }
export function exportToCartridgesPayload(data: ifaces.CartridgesPayload): string {
    const dataToExport: CartridgesPayload = new CartridgesPayload(data);
    return dataToExport.export();
}
export class EmptyClassInput extends Input<ifaces.EmptyClass> { constructor(data: CartesiInput) { super(models['EmptyClass'],data); } }
export function decodeToEmptyClassInput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): EmptyClassInput {
    return new EmptyClassInput(output as CartesiInput);
}

export class EmptyClass extends IOData<ifaces.EmptyClass> { constructor(data: ifaces.EmptyClass, validate: boolean = true) { super(models['EmptyClass'],data,validate); } }
export function exportToEmptyClass(data: ifaces.EmptyClass): string {
    const dataToExport: EmptyClass = new EmptyClass(data);
    return dataToExport.export();
}
export class CartridgeInfo extends Output<ifaces.CartridgeInfo> { constructor(output: CartesiReport | InspectReport) { super(models['CartridgeInfo'],output); } }
export function decodeToCartridgeInfo(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgeInfo {
    return new CartridgeInfo(output as CartesiReport);
}

export class CartridgesOutput extends Output<ifaces.CartridgesOutput> { constructor(output: CartesiReport | InspectReport) { super(models['CartridgesOutput'],output); } }
export function decodeToCartridgesOutput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgesOutput {
    return new CartridgesOutput(output as CartesiReport);
}

export class RulesOutput extends Output<ifaces.RulesOutput> { constructor(output: CartesiReport | InspectReport) { super(models['RulesOutput'],output); } }
export function decodeToRulesOutput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): RulesOutput {
    return new RulesOutput(output as CartesiReport);
}

export class RuleTagsOutput extends Output<ifaces.RuleTagsOutput> { constructor(output: CartesiReport | InspectReport) { super(models['RuleTagsOutput'],output); } }
export function decodeToRuleTagsOutput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): RuleTagsOutput {
    return new RuleTagsOutput(output as CartesiReport);
}

export class CartridgeInserted extends Event<ifaces.CartridgeInserted> { constructor(output: CartesiNotice) { super(models['CartridgeInserted'],output); } }
export function decodeToCartridgeInserted(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgeInserted {
    return new CartridgeInserted(output as CartesiNotice);
}

export class CartridgeRemoved extends Event<ifaces.CartridgeRemoved> { constructor(output: CartesiNotice) { super(models['CartridgeRemoved'],output); } }
export function decodeToCartridgeRemoved(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): CartridgeRemoved {
    return new CartridgeRemoved(output as CartesiNotice);
}

export class RuleCreated extends Event<ifaces.RuleCreated> { constructor(output: CartesiNotice) { super(models['RuleCreated'],output); } }
export function decodeToRuleCreated(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): RuleCreated {
    return new RuleCreated(output as CartesiNotice);
}

export class VerificationOutput extends Event<ifaces.VerificationOutput> { constructor(output: CartesiNotice) { super(models['VerificationOutput'],output); } }
export function decodeToVerificationOutput(output: CartesiReport | CartesiNotice | CartesiVoucher | InspectReport | CartesiInput): VerificationOutput {
    return new VerificationOutput(output as CartesiNotice);
}


/**
 * Model
 */

export const models: Models = {
    'InsertCartridgePayload': {
        ioType:IOType.mutationPayload,
        abiTypes:['bytes'],
        params:['data'],
        decoder: decodeToInsertCartridgePayloadInput,
        exporter: exportToInsertCartridgePayload,
        validator: ajv.compile<ifaces.InsertCartridgePayload>(JSON.parse('{"title": "InsertCartridgePayload", "type": "object", "properties": {"data": {"type": "string", "format": "binary"}}, "required": ["data"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'VerifyPayload': {
        ioType:IOType.mutationPayload,
        abiTypes:['bytes32', 'bytes32', 'bytes', 'int'],
        params:['rule_id', 'outcard_hash', 'tape', 'claimed_score'],
        decoder: decodeToVerifyPayloadInput,
        exporter: exportToVerifyPayload,
        validator: ajv.compile<ifaces.VerifyPayload>(JSON.parse('{"title": "VerifyPayload", "type": "object", "properties": {"rule_id": {"type": "string", "format": "binary"}, "outcard_hash": {"type": "string", "format": "binary"}, "tape": {"type": "string", "format": "binary"}, "claimed_score": {"type": "integer"}}, "required": ["rule_id", "outcard_hash", "tape", "claimed_score"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'RemoveCartridgePayload': {
        ioType:IOType.mutationPayload,
        abiTypes:['bytes32'],
        params:['id'],
        decoder: decodeToRemoveCartridgePayloadInput,
        exporter: exportToRemoveCartridgePayload,
        validator: ajv.compile<ifaces.RemoveCartridgePayload>(JSON.parse('{"title": "RemoveCartridgePayload", "type": "object", "properties": {"id": {"type": "string", "format": "binary"}}, "required": ["id"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'RuleData': {
        ioType:IOType.mutationPayload,
        abiTypes:['bytes32', 'string', 'string', 'string', 'bytes', 'string', 'uint', 'uint', 'string[]'],
        params:['cartridge_id', 'name', 'description', 'args', 'in_card', 'score_function', 'start', 'end', 'tags'],
        decoder: decodeToRuleDataInput,
        exporter: exportToRuleData,
        validator: ajv.compile<ifaces.RuleData>(JSON.parse('{"title": "RuleData", "type": "object", "properties": {"cartridge_id": {"type": "string", "format": "binary"}, "name": {"type": "string"}, "description": {"type": "string"}, "args": {"type": "string"}, "in_card": {"type": "string", "format": "binary"}, "score_function": {"type": "string"}, "start": {"type": "integer"}, "end": {"type": "integer"}, "tags": {"type": "array", "items": {"type": "string"}}}, "required": ["cartridge_id", "name", "description", "args", "in_card", "score_function", "start", "end", "tags"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'ExternalVerificationPayload': {
        ioType:IOType.mutationPayload,
        abiTypes:['address[]', 'bytes32[]', 'bytes32[]', 'uint256[]', 'uint256[]', 'int256[]', 'uint256[]'],
        params:['user_addresses', 'rule_ids', 'tape_hashes', 'tape_input_indexes', 'tape_timestamps', 'scores', 'error_codes'],
        decoder: decodeToExternalVerificationPayloadInput,
        exporter: exportToExternalVerificationPayload,
        validator: ajv.compile<ifaces.ExternalVerificationPayload>(JSON.parse('{"title": "ExternalVerificationPayload", "type": "object", "properties": {"user_addresses": {"type": "array", "items": {"type": "string"}}, "rule_ids": {"type": "array", "items": {"type": "string", "format": "binary"}}, "tape_hashes": {"type": "array", "items": {"type": "string", "format": "binary"}}, "tape_input_indexes": {"type": "array", "items": {"type": "integer"}}, "tape_timestamps": {"type": "array", "items": {"type": "integer"}}, "scores": {"type": "array", "items": {"type": "integer"}}, "error_codes": {"type": "array", "items": {"type": "integer"}}}, "required": ["user_addresses", "rule_ids", "tape_hashes", "tape_input_indexes", "tape_timestamps", "scores", "error_codes"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'CartridgePayload': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['id'],
        decoder: decodeToCartridgePayloadInput,
        exporter: exportToCartridgePayload,
        validator: ajv.compile<ifaces.CartridgePayload>(JSON.parse('{"title": "CartridgePayload", "type": "object", "properties": {"id": {"type": "string"}}, "required": ["id"]}'))
    },
    'CartridgePayloadSplittable': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['id', 'part'],
        decoder: decodeToCartridgePayloadSplittableInput,
        exporter: exportToCartridgePayloadSplittable,
        validator: ajv.compile<ifaces.CartridgePayloadSplittable>(JSON.parse('{"title": "CartridgePayloadSplittable", "type": "object", "properties": {"id": {"type": "string"}, "part": {"type": "integer"}}, "required": ["id"]}'))
    },
    'GetRuleTagsPayload': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['cartridge_id'],
        decoder: decodeToGetRuleTagsPayloadInput,
        exporter: exportToGetRuleTagsPayload,
        validator: ajv.compile<ifaces.GetRuleTagsPayload>(JSON.parse('{"title": "GetRuleTagsPayload", "type": "object", "properties": {"cartridge_id": {"type": "string"}}}'))
    },
    'GetRulesPayload': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['cartridge_id', 'id', 'ids', 'active_ts', 'name', 'page', 'page_size'],
        decoder: decodeToGetRulesPayloadInput,
        exporter: exportToGetRulesPayload,
        validator: ajv.compile<ifaces.GetRulesPayload>(JSON.parse('{"title": "GetRulesPayload", "type": "object", "properties": {"cartridge_id": {"type": "string"}, "id": {"type": "string"}, "ids": {"type": "array", "items": {"type": "string"}}, "active_ts": {"type": "integer"}, "name": {"type": "string"}, "page": {"type": "integer"}, "page_size": {"type": "integer"}}}'))
    },
    'CartridgesPayload': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:['name', 'authors', 'tags', 'page', 'page_size', 'get_cover'],
        decoder: decodeToCartridgesPayloadInput,
        exporter: exportToCartridgesPayload,
        validator: ajv.compile<ifaces.CartridgesPayload>(JSON.parse('{"title": "CartridgesPayload", "type": "object", "properties": {"name": {"type": "string"}, "authors": {"type": "array", "items": {"type": "string"}}, "tags": {"type": "array", "items": {"type": "string"}}, "page": {"type": "integer"}, "page_size": {"type": "integer"}, "get_cover": {"type": "boolean"}}}'))
    },
    'EmptyClass': {
        ioType:IOType.queryPayload,
        abiTypes:[],
        params:[],
        decoder: decodeToEmptyClassInput,
        exporter: exportToEmptyClass,
        validator: ajv.compile<ifaces.EmptyClass>(JSON.parse('{"title": "EmptyClass", "type": "object", "properties": {}}'))
    },
    'CartridgeInfo': {
        ioType:IOType.report,
        abiTypes:[],
        params:['id', 'name', 'user_address', 'authors', 'info', 'created_at', 'cover'],
        decoder: decodeToCartridgeInfo,
        validator: ajv.compile<ifaces.CartridgeInfo>(JSON.parse('{"title": "CartridgeInfo", "type": "object", "properties": {"id": {"type": "string"}, "name": {"type": "string"}, "user_address": {"type": "string"}, "authors": {"type": "array", "items": {"type": "string"}}, "info": {"$ref": "#/definitions/InfoCartridge"}, "created_at": {"type": "integer"}, "cover": {"type": "string"}}, "required": ["id", "name", "user_address", "authors", "created_at"], "definitions": {"Author": {"title": "Author", "type": "object", "properties": {"name": {"type": "string"}, "link": {"type": "string"}}, "required": ["name", "link"]}, "InfoCartridge": {"title": "InfoCartridge", "type": "object", "properties": {"name": {"type": "string"}, "summary": {"type": "string"}, "description": {"type": "string"}, "version": {"type": "string"}, "status": {"type": "string"}, "tags": {"type": "array", "items": {"type": "string"}}, "authors": {"type": "array", "items": {"$ref": "#/definitions/Author"}}, "url": {"type": "string"}}, "required": ["name", "tags"]}}}'))
    },
    'CartridgesOutput': {
        ioType:IOType.report,
        abiTypes:[],
        params:['data', 'total', 'page'],
        decoder: decodeToCartridgesOutput,
        validator: ajv.compile<ifaces.CartridgesOutput>(JSON.parse('{"title": "CartridgesOutput", "type": "object", "properties": {"data": {"type": "array", "items": {"$ref": "#/definitions/CartridgeInfo"}}, "total": {"type": "integer"}, "page": {"type": "integer"}}, "required": ["data", "total", "page"], "definitions": {"Author": {"title": "Author", "type": "object", "properties": {"name": {"type": "string"}, "link": {"type": "string"}}, "required": ["name", "link"]}, "InfoCartridge": {"title": "InfoCartridge", "type": "object", "properties": {"name": {"type": "string"}, "summary": {"type": "string"}, "description": {"type": "string"}, "version": {"type": "string"}, "status": {"type": "string"}, "tags": {"type": "array", "items": {"type": "string"}}, "authors": {"type": "array", "items": {"$ref": "#/definitions/Author"}}, "url": {"type": "string"}}, "required": ["name", "tags"]}, "CartridgeInfo": {"title": "CartridgeInfo", "type": "object", "properties": {"id": {"type": "string"}, "name": {"type": "string"}, "user_address": {"type": "string"}, "authors": {"type": "array", "items": {"type": "string"}}, "info": {"$ref": "#/definitions/InfoCartridge"}, "created_at": {"type": "integer"}, "cover": {"type": "string"}}, "required": ["id", "name", "user_address", "authors", "created_at"]}}}'))
    },
    'RulesOutput': {
        ioType:IOType.report,
        abiTypes:[],
        params:['data', 'total', 'page'],
        decoder: decodeToRulesOutput,
        validator: ajv.compile<ifaces.RulesOutput>(JSON.parse('{"title": "RulesOutput", "type": "object", "properties": {"data": {"type": "array", "items": {"$ref": "#/definitions/RuleInfo"}}, "total": {"type": "integer"}, "page": {"type": "integer"}}, "required": ["data", "total", "page"], "definitions": {"RuleInfo": {"title": "RuleInfo", "type": "object", "properties": {"id": {"type": "string"}, "name": {"type": "string"}, "description": {"type": "string"}, "cartridge_id": {"type": "string"}, "created_by": {"type": "string"}, "created_at": {"type": "integer"}, "args": {"type": "string"}, "in_card": {"type": "string", "format": "binary"}, "score_function": {"type": "string"}, "n_tapes": {"type": "integer"}, "n_verified": {"type": "integer"}, "start": {"type": "integer"}, "end": {"type": "integer"}, "tags": {"type": "array", "items": {"type": "string"}}}, "required": ["id", "name", "description", "cartridge_id", "created_by", "created_at", "args", "in_card", "score_function", "n_tapes", "n_verified", "tags"]}}}'))
    },
    'RuleTagsOutput': {
        ioType:IOType.report,
        abiTypes:[],
        params:['tags'],
        decoder: decodeToRuleTagsOutput,
        validator: ajv.compile<ifaces.RuleTagsOutput>(JSON.parse('{"title": "RuleTagsOutput", "type": "object", "properties": {"tags": {"type": "array", "items": {"type": "string"}}}, "required": ["tags"]}'))
    },
    'CartridgeInserted': {
        ioType:IOType.notice,
        abiTypes:['string', 'string', 'uint'],
        params:['cartridge_id', 'user_address', 'timestamp'],
        decoder: decodeToCartridgeInserted,
        validator: ajv.compile<ifaces.CartridgeInserted>(JSON.parse('{"title": "CartridgeInserted", "type": "object", "properties": {"cartridge_id": {"type": "string"}, "user_address": {"type": "string"}, "timestamp": {"type": "integer"}}, "required": ["cartridge_id", "user_address", "timestamp"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'CartridgeRemoved': {
        ioType:IOType.notice,
        abiTypes:['string', 'uint'],
        params:['cartridge_id', 'timestamp'],
        decoder: decodeToCartridgeRemoved,
        validator: ajv.compile<ifaces.CartridgeRemoved>(JSON.parse('{"title": "CartridgeRemoved", "type": "object", "properties": {"cartridge_id": {"type": "string"}, "timestamp": {"type": "integer"}}, "required": ["cartridge_id", "timestamp"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'RuleCreated': {
        ioType:IOType.notice,
        abiTypes:['bytes32', 'string', 'uint'],
        params:['rule_id', 'created_by', 'created_at'],
        decoder: decodeToRuleCreated,
        validator: ajv.compile<ifaces.RuleCreated>(JSON.parse('{"title": "RuleCreated", "type": "object", "properties": {"rule_id": {"type": "string", "format": "binary"}, "created_by": {"type": "string"}, "created_at": {"type": "integer"}}, "required": ["rule_id", "created_by", "created_at"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    'VerificationOutput': {
        ioType:IOType.notice,
        abiTypes:['bytes32', 'bytes32', 'int', 'address', 'uint', 'int', 'string', 'int', 'bytes32', 'int', 'uint'],
        params:['version', 'cartridge_id', 'cartridge_input_index', 'user_address', 'timestamp', 'score', 'rule_id', 'rule_input_index', 'tape_hash', 'tape_input_index', 'error_code'],
        decoder: decodeToVerificationOutput,
        validator: ajv.compile<ifaces.VerificationOutput>(JSON.parse('{"title": "VerificationOutput", "type": "object", "properties": {"version": {"type": "string", "format": "binary"}, "cartridge_id": {"type": "string", "format": "binary"}, "cartridge_input_index": {"type": "integer"}, "user_address": {"type": "string"}, "timestamp": {"type": "integer"}, "score": {"type": "integer"}, "rule_id": {"type": "string"}, "rule_input_index": {"type": "integer"}, "tape_hash": {"type": "string", "format": "binary"}, "tape_input_index": {"type": "integer"}, "error_code": {"type": "integer"}}, "required": ["version", "cartridge_id", "cartridge_input_index", "user_address", "timestamp", "score", "rule_id", "rule_input_index", "tape_hash", "tape_input_index", "error_code"]}'.replaceAll('integer','string","format":"biginteger')))
    },
    };