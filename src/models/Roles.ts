import { EColor } from './Color'

import { isKeyOfObject, isNumber } from "../../lib/hd-helper";

// -----------------------------------------------------------------------------

/**
 * Enum for the different roles that exist in the game (KNIGHT, QUEEN, BISHOP,
 * ROOK). Each role has different pattern of movement.
 */
export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }

/**
 * A map used for the pawns. It maps the color of the field the pawn currently
 * stand on, to the role it has right now. Thus, this map determines the role
 * and what moves the pawn can do, right now.
 */
export type TRoles = {[fieldColor in EColor]: ERole}

export function isRoles(roles: any): roles is TRoles {
    if (!isColorRoleMap(roles))
        return false;

    // check if roles is any of the valid combinations from ROLES constant.
    for (let i = EColor.RED, ie = EColor.BLUE; i <= ie; i++) {
        if (isSameRoles(roles, ROLES[i]))
            return true;
    }

    return false;
}

export function getRoles(knightColor: EColor): TRoles {
    return ROLES[knightColor];
}

// -----------------------------------------------------------------------------

const ROLES = {
    [EColor.RED]: {
        [EColor.RED]:    ERole.KNIGHT,
        [EColor.GREEN]:  ERole.QUEEN,
        [EColor.YELLOW]: ERole.BISHOP,
        [EColor.BLUE]:   ERole.ROOK
    },
    [EColor.GREEN]: {
        [EColor.RED]:    ERole.ROOK,
        [EColor.GREEN]:  ERole.KNIGHT,
        [EColor.YELLOW]: ERole.QUEEN,
        [EColor.BLUE]:   ERole.BISHOP
    },
    [EColor.YELLOW]: {
        [EColor.RED]:    ERole.BISHOP,
        [EColor.GREEN]:  ERole.ROOK,
        [EColor.YELLOW]: ERole.KNIGHT,
        [EColor.BLUE]:   ERole.QUEEN
    },
    [EColor.BLUE]: {
        [EColor.RED]:    ERole.QUEEN,
        [EColor.GREEN]:  ERole.BISHOP,
        [EColor.YELLOW]: ERole.ROOK,
        [EColor.BLUE]:   ERole.KNIGHT
    }
}

function isColorRoleMap(obj: any): obj is TRoles {
    return isKeyOfObject<TRoles,ERole>(obj, EColor.RED, isRole)
        && isKeyOfObject<TRoles,ERole>(obj, EColor.GREEN, isRole)
        && isKeyOfObject<TRoles,ERole>(obj, EColor.YELLOW, isRole)
        && isKeyOfObject<TRoles,ERole>(obj, EColor.BLUE, isRole)
}

function isRole(role: any): role is ERole {
    return isNumber(role) && ERole[role] !== undefined;
}

function isSameRoles(a: TRoles, b: TRoles): boolean {
    for (const key in a) {
        const nKey = parseInt(key);
        if (a[(nKey as keyof TRoles)] !== b[(nKey as keyof TRoles)])
            return false;
    }
    return true;
}