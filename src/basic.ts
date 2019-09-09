import { EColors, IPosition } from "./types";
import { isNumber } from "./helper";

export function isColor(color :EColors) :color is EColors {
    return isNumber(color) && EColors[color] !== undefined
}

export function isPosition(pos :IPosition) :pos is IPosition {
    return 'row' in pos && isNumber(pos.row)
        && 'col' in pos && isNumber(pos.col)
}

/** Returns true if position can be found in the positions array.
 * 
 * Hint: It is possible to pass both IPosition or IMove as IMoves is just a
 * specialization of IPosition.
 */
export function isInPositions(position :IPosition, positions :IPosition[]) :boolean {
    for (let i = 0, ie = positions.length; i < ie; i++) {
        if (position.row === positions[i].row && position.col === positions[i].col)
            return true
    }
    return false
}

const R = EColors.RED
const G = EColors.GREEN
const Y = EColors.YELLOW
const B = EColors.BLUE

export const BOARD :EColors[][] = [
    [B, R, B, Y, G, R, B, Y],
    [R, G, R, B, Y, G, R, B],
    [G, Y, R, G, R, B, B, Y],
    [Y, B, G, Y, G, R, Y, G],
    [B, R, Y, B, R, B, G, R],
    [R, G, G, Y, B, Y, R, B],
    [G, Y, B, R, G, Y, B, Y],
    [R, G, Y, B, R, G, Y, G]
]