import { ERole, EColor, IPosition } from "./main";
import { isNumber } from "./helper";

export function isRole(role :ERole) :role is ERole {
    return isNumber(role) && ERole[role] !== undefined
}

export function isColor(color :EColor) :color is EColor {
    return isNumber(color) && EColor[color] !== undefined
}

export function isPosition(pos :IPosition) :pos is IPosition {
    return 'row' in pos && isNumber(pos.row)
        && 'col' in pos && isNumber(pos.col)
}

/** Returns true if position can be found in the positions array.
 */
export function isInPositions(position :IPosition, positions :IPosition[]) :boolean {
    for (let i = 0, ie = positions.length; i < ie; i++) {
        if (position.row === positions[i].row && position.col === positions[i].col)
            return true
    }
    return false
}