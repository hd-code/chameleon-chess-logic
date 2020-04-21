import { EFieldColor } from './board';

import { isInteger, hasKey } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * An enum, which represents the four chess roles a pawn could have.
 * - KNIGHT: 0
 * - QUEEN: 1
 * - BISHOP: 2
 * - ROOK: 3
 */
export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }

/** Type guard for `ERole`. */
export function isRole(role: any): role is ERole {
    return isInteger(role) && ERole[role] !== undefined;
}

// -----------------------------------------------------------------------------

/**
 * The main idea of the game is, that pawns change their role according to the
 * color of the field, the pawn stands on. This changing is not a random
 * procedure. Each pawn has a very specific mapping from a field color to a
 * particular role. An object of type `TRoles` stores this mapping. It is an
 * object with the four field colors `EFieldColor` as keys and the corresponding
 * role `ERole` as values.
 * 
 * To find out, what role a pawn currently has, get the color of the field the
 * pawn currently is on. Then, lookup the mapped role in the `TRoles` object.
 */
export type TRoles = {[fieldColor in EFieldColor]: ERole}

/** Type guard for `TRoles`. Checks the types and also if it is a valid mapping,
 * because there are only four mappings, that are valid. */
export function isRoles(roles: any): roles is TRoles {
    return hasKey(roles, EFieldColor.RED, isRole)
        && hasKey(roles, EFieldColor.GREEN, isRole)
        && hasKey(roles, EFieldColor.YELLOW, isRole)
        && hasKey(roles, EFieldColor.BLUE, isRole)
        && isValidRoles(roles);
}

/** Returns a field-color-to-role mapping for a pawn. There are four different
 * possible combinations. To specify, which combination should be used, a
 * parameter must be passed. That parameter indicates, which of the field color
 * should be mapped to the role 'KNIGHT'. */
export function getRoles(knightColor: EFieldColor): TRoles {
    let color = knightColor;
    let result = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (let i = 0; i <= ERole.ROOK; i++) {
        result[color] = i;
        color = color < EFieldColor.BLUE ? color + 1 : EFieldColor.RED;
    }
    return result;
}

// -----------------------------------------------------------------------------

function isValidRoles(roles: TRoles): boolean {
    let role = roles[EFieldColor.RED];
    for (const key in roles) {
        const fieldColor = parseInt(key);
        if (roles[fieldColor as EFieldColor] !== role) return false;
        role = role < ERole.ROOK ? role + 1 : ERole.KNIGHT;
    }
    return true;
}