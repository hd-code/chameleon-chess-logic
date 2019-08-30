export enum EColors { RED,  GREEN,  YELLOW,  BLUE }
export enum ERoles  { KNIGHT,  QUEEN,  BISHOP,  ROOK }

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

export interface IPosition {
    row: number
    col: number
}

/** Returns true if a position is also found in the position array.
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