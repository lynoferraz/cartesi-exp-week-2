import { RuleInfo } from "../backend-libs/core/ifaces";

export const SOCIAL_MEDIA_HASHTAGS = [];


export interface Contest {
  // rule_id:string,
  // start:number,
  // end:number,
  prize:string,
  winner?:string
}

export enum ContestStatus {
  IN_PROGRESS,
  NOT_INITIATED,
  VALIDATED,
  FINISHED,
  INVALID,
}

export const getContestStatus = (rule: RuleInfo): ContestStatus => {
  if (rule.start == undefined || rule.end == undefined) return ContestStatus.INVALID;
  const currentTs = Math.floor((new Date()).valueOf()/1000);
  if (currentTs < rule.start) return ContestStatus.NOT_INITIATED;
  if (currentTs < rule.end) return ContestStatus.IN_PROGRESS;
  if (rule.n_tapes == rule.n_verified) return ContestStatus.VALIDATED;
  return ContestStatus.FINISHED
}

export const getContestStatusMessage = (status: ContestStatus): string => {
  switch (status) {
    case ContestStatus.IN_PROGRESS:
      return "Open";
    case ContestStatus.NOT_INITIATED:
      return "Upcomming";
    case ContestStatus.FINISHED:
    case ContestStatus.VALIDATED:
      return "Finished";
  
    default:
      return "";
  }
}

export const formatBytes = (bytes: number,decimals?:number): string => {
  if(bytes == 0) return '0 Bytes';
  var k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const BASE64_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
export function byteToBase64(bytes: Uint8Array): String {
    let newBase64 = '';
    let currentChar = 0;
    for (let i=0; i<bytes.length; i++) {   // Go over three 8-bit bytes to encode four base64 6-bit chars
        if (i%3===0) { // First Byte
            currentChar = (bytes[i] >> 2);      // First 6-bits for first base64 char
            newBase64 += BASE64_KEY[currentChar];      // Add the first base64 char to the string
            currentChar = (bytes[i] << 4) & 63; // Erase first 6-bits, add first 2 bits for second base64 char
        }
        if (i%3===1) { // Second Byte
            currentChar += (bytes[i] >> 4);     // Concat first 4-bits from second byte for second base64 char
            newBase64 += BASE64_KEY[currentChar];      // Add the second base64 char to the string
            currentChar = (bytes[i] << 2) & 63; // Add two zeros, add 4-bits from second half of second byte
        }
        if (i%3===2) { // Third Byte
            currentChar += (bytes[i] >> 6);     // Concat first 2-bits of third byte for the third base64 char
            newBase64 += BASE64_KEY[currentChar];      // Add the third base64 char to the string
            currentChar = bytes[i] & 63;        // Add last 6-bits from third byte for the fourth base64 char
            newBase64 += BASE64_KEY[currentChar];      // Add the fourth base64 char to the string
        }
    }
    if (bytes.length%3===1) { // Pad for two missing bytes
        newBase64 += `${BASE64_KEY[currentChar]}==`;
    }
    if (bytes.length%3===2) { // Pad one missing byte
        newBase64 += `${BASE64_KEY[currentChar]}=`;
    }
    return newBase64;
}