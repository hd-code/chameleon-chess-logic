import { IPosition } from '../types';

import { getBoardSize } from './board';

import { hasKey } from '../../lib/obray';

// -----------------------------------------------------------------------------

/** Type guard for `IPosition`. */
export function isPosition(position: any): position is IPosition {
    const boardSize = getBoardSize();
    return hasKey(position, 'row', isInteger) && position.row >= 0 && position.row < boardSize.numOfRows
        && hasKey(position, 'col', isInteger) && position.col >= 0 && position.col < boardSize.numOfCols;
}

export function isSamePosition(a: IPosition, b: IPosition): boolean {
    return a.row === b.row && a.col === b.col;
}

export function isInPositions(postion: IPosition, positions: IPosition[]): boolean {
    for (let i = 0, ie = positions.length; i < ie; i++) {
        if (isSamePosition(postion, positions[i])) {
            return true;
        }
    }
    return false;
}

export function sortPositions(a: IPosition, b: IPosition): number {
    return a.row !== b.row ? a.row - b.row : a.col - b.col;
}

// -----------------------------------------------------------------------------

function isInteger(int: any): int is number {
    return typeof int === 'number' && Math.floor(int) === int;
}