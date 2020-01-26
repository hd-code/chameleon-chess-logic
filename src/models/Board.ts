import { EColor } from './Color';
import { IPosition } from './Position';

// -----------------------------------------------------------------------------

/**
 * A two-dimensional array of colors. They present the 8x8 game board giving the
 * color for each field.
 */
export type TBoard = EColor[][]

export function getBoard(): TBoard {
    return BOARD;
}

export function getFieldColor(position: IPosition): EColor {
    return BOARD[position.row][position.col];
}

// -----------------------------------------------------------------------------

const [R,G,Y,B] = [EColor.RED, EColor.GREEN, EColor.YELLOW, EColor.BLUE]
const BOARD: TBoard = [
    [B, R, B, Y, G, R, B, Y],
    [R, G, R, B, Y, G, R, B],
    [G, Y, R, G, R, B, B, Y],
    [Y, B, G, Y, G, R, Y, G],
    [B, R, Y, B, R, B, G, R],
    [R, G, G, Y, B, Y, R, B],
    [G, Y, B, R, G, Y, B, Y],
    [R, G, Y, B, R, G, Y, G]
];