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

export function isWithinMoves(move :IPosition, moves :IPosition[]) :boolean {
    for (var i = 0, ie = moves.length; i < ie; i++) {
        if (move.row === moves[i].row && move.col === moves[i].col)
            return true
    }
    return false
}