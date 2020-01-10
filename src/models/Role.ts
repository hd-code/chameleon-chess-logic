import { isNumber } from "../helper";

// -----------------------------------------------------------------------------

export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }

export function isRole(role: ERole): role is ERole {
    return isNumber(role) && ERole[role] !== undefined
}