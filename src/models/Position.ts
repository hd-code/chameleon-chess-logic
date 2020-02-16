import { isKeyOfObject, isInteger } from '../../lib/hd-helper';

// -----------------------------------------------------------------------------

/** Specifies a position (a specific field) on the game board. */
export interface IPosition {
    /** The row of the field on the game board. */
    row: number;
    /** The column of the field on the game board. */
    col: number;
}

export function isPosition(pos: any): pos is IPosition {
    return isKeyOfObject(pos, 'row', isInteger)
        && isKeyOfObject(pos, 'col', isInteger);
}

export function isSamePosition(a: IPosition, b: IPosition): boolean {
    return a.row === b.row && a.col === b.col;
}

export function isPositionInPositions(position: IPosition, positions: IPosition[]): boolean {
    return positions.reduce((result, pos) => {
        return result || isSamePosition(pos, position);
    }, <boolean>false);
}