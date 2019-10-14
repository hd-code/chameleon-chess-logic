import { Role, Color, Position } from "./main";
import { isNumber } from "./helper";

export function isRole(role :Role) :role is Role {
    return isNumber(role) && Role[role] !== undefined
}

export function isColor(color :Color) :color is Color {
    return isNumber(color) && Color[color] !== undefined
}

export function isPosition(pos :Position) :pos is Position {
    return 'row' in pos && isNumber(pos.row)
        && 'col' in pos && isNumber(pos.col)
}

/** Returns true if position can be found in the positions array.
 */
export function isInPositions(position :Position, positions :Position[]) :boolean {
    for (let i = 0, ie = positions.length; i < ie; i++) {
        if (position.row === positions[i].row && position.col === positions[i].col)
            return true
    }
    return false
}