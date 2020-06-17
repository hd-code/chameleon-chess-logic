import { EFieldColor, ERole, MRoles } from '../types';

import { deepClone, hasKey } from '../../lib/obray';

// -----------------------------------------------------------------------------

/** Type guard for `MRoles`. Checks the types and also if it is a valid mapping,
 * because there are only four mappings, that are valid. */
export function isRoles(roles: any): roles is MRoles {
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
export function getRoles(knightColor: EFieldColor): MRoles {
    return deepClone(KNIGHT_COLOR_TO_ROLES[knightColor]);
}

// -----------------------------------------------------------------------------

const KNIGHT_COLOR_TO_ROLES = {
    [EFieldColor.RED]: {
        [EFieldColor.RED]:    ERole.KNIGHT,
        [EFieldColor.GREEN]:  ERole.QUEEN,
        [EFieldColor.YELLOW]: ERole.BISHOP,
        [EFieldColor.BLUE]:   ERole.ROOK,
    },
    [EFieldColor.GREEN]: {
        [EFieldColor.RED]:    ERole.ROOK,
        [EFieldColor.GREEN]:  ERole.KNIGHT,
        [EFieldColor.YELLOW]: ERole.QUEEN,
        [EFieldColor.BLUE]:   ERole.BISHOP,
    },
    [EFieldColor.YELLOW]: {
        [EFieldColor.RED]:    ERole.BISHOP,
        [EFieldColor.GREEN]:  ERole.ROOK,
        [EFieldColor.YELLOW]: ERole.KNIGHT,
        [EFieldColor.BLUE]:   ERole.QUEEN,
    },
    [EFieldColor.BLUE]: {
        [EFieldColor.RED]:    ERole.QUEEN,
        [EFieldColor.GREEN]:  ERole.BISHOP,
        [EFieldColor.YELLOW]: ERole.ROOK,
        [EFieldColor.BLUE]:   ERole.KNIGHT,
    },
};

/** Type guard for `ERole`. */
function isRole(role: any): role is ERole {
    return typeof role === 'number' && ERole[role] !== undefined;
}

function isValidRoles(roles: MRoles): boolean {
    for (const key in KNIGHT_COLOR_TO_ROLES) {
        const nKey = parseInt(key);
        const map = KNIGHT_COLOR_TO_ROLES[nKey as keyof MRoles];
        if (isSameRoleMapping(roles, map)) {
            return true;
        }
    }
    return false;
}

function isSameRoleMapping(a: MRoles, b: MRoles): boolean {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}