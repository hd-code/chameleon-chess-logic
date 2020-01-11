import { isNumber } from "../lib/hd-helper";

// -----------------------------------------------------------------------------

export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }

export function isRole(role: any): role is ERole {
    return isNumber(role) && ERole[role] !== undefined;
}