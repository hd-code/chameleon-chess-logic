import { isNumber } from "./helper";

export enum ERole { KNIGHT, QUEEN, BISHOP, ROOK }

export enum EColor { RED, GREEN, YELLOW, BLUE }

const R = EColor.RED
const G = EColor.GREEN
const Y = EColor.YELLOW
const B = EColor.BLUE
export const BOARD: EColor[][] = [
    [B, R, B, Y, G, R, B, Y],
    [R, G, R, B, Y, G, R, B],
    [G, Y, R, G, R, B, B, Y],
    [Y, B, G, Y, G, R, Y, G],
    [B, R, Y, B, R, B, G, R],
    [R, G, G, Y, B, Y, R, B],
    [G, Y, B, R, G, Y, B, Y],
    [R, G, Y, B, R, G, Y, G]
]

export interface IPosition {
    row: number
    col: number
}

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