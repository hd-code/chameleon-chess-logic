import { isKeyOfObject, isNumber } from "../../lib/hd-helper";

// -----------------------------------------------------------------------------

export interface IPosition {
    row: number;
    col: number;
}

export function isPosition(pos: any): pos is IPosition {
    return isKeyOfObject(pos, 'row', isNumber)
        && isKeyOfObject(pos, 'col', isNumber);
}

export function isSamePosition(a: IPosition, b: IPosition): boolean {
    return a.row === b.row && a.col === b.col;
}

export function isPositionInPositions(position: IPosition, positions: IPosition[]): boolean {
    return positions.reduce((result, pos) => {
        return result || isSamePosition(pos, position);
    }, <boolean>false);
}