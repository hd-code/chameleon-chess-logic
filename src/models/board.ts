import { deepClone } from '../../lib/obray';

import { TBoard, EFieldColor, IPosition } from '../types';

// -----------------------------------------------------------------------------

/** Type guard for `EPlayer`. */
export function isFieldColor(fieldColor: any): fieldColor is EFieldColor {
    return typeof fieldColor === 'number' && EFieldColor[fieldColor] !== undefined;
}

export function getBoard(): TBoard {
    return deepClone(BOARD);
}

export function getBoardSize() {
    return {
        numOfRows: BOARD.length,
        numOfCols: BOARD[0].length
    };
}

/** Returns the color of the field on the game board at a given position. */
export function getFieldColor(position: IPosition): EFieldColor {
    return BOARD[position.row][position.col];
}

// -----------------------------------------------------------------------------

const [R,G,Y,B] = [EFieldColor.RED, EFieldColor.GREEN, EFieldColor.YELLOW, EFieldColor.BLUE]
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