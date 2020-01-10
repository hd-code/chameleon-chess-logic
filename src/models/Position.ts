import { isNumber } from "../helper";

// -----------------------------------------------------------------------------

export interface IPosition {
    row: number
    col: number
}

export function isPosition(pos: IPosition): pos is IPosition {
    return 'row' in pos && isNumber(pos.row)
        && 'col' in pos && isNumber(pos.col)
}

export function isSamePosition(a: IPosition, b: IPosition): boolean {
    return a.row === b.row && a.col === b.col;
}

export function isPositionInPositions(position: IPosition, positions: IPosition[]): boolean {
    return positions.reduce((result, pos) => {
        return result || isSamePosition(pos, position);
    }, <boolean>false);
}