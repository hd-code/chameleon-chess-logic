import { IPawn } from "./Pawns";
import { IPosition, isPosition } from "./Position";

import { isObject } from "../helper"

// -----------------------------------------------------------------------------

export interface ILimits {
    lower: IPosition
    upper: IPosition
}

export function isLimits(limits: ILimits): limits is ILimits {
    return isObject(limits)
        && 'lower' in limits && isPosition(limits.lower)
        && 'upper' in limits && isPosition(limits.upper)
        && isWithinRange(limits)
        && !isFieldSmallerThanAllowed(limits);
}

export function isSmallestFieldSize(limits: ILimits): boolean {
    return limits.upper.row - limits.lower.row + 1 === SMALLEST_FIELD_SIZE.row
        && limits.upper.col - limits.lower.col + 1 === SMALLEST_FIELD_SIZE.col;
}

export function isPositionWithinLimits(pos: IPosition, limits: ILimits): boolean {
    return limits.lower.row <= pos.row &&  pos.row <= limits.upper.row
        && limits.lower.col <= pos.col &&  pos.col <= limits.upper.col
}

export function getStartingLimits(): ILimits {
    return {
        lower: {row: MIN_ROW, col: MIN_COL},
        upper: {row: MAX_ROW, col: MAX_COL}
    }
}

export function calcLimits(pawns: IPawn[], oldLimits: ILimits): ILimits {
    if (isSmallestFieldSize(oldLimits))
        return oldLimits;

    let result = calcPureLimits(pawns);
    return increaseLimitsToMinFieldSize(result, oldLimits);
}

// -----------------------------------------------------------------------------

const MIN_ROW = 0, MAX_ROW = 7;
const MIN_COL = 0, MAX_COL = 7;

const SMALLEST_FIELD_SIZE = <IPosition>{ row: 3, col: 3 };

function isWithinRange(limits: ILimits): boolean {
    return MIN_ROW <= limits.lower.row && limits.upper.row <= MAX_ROW
        && MIN_COL <= limits.lower.col && limits.upper.col <= MAX_COL;
}

function isFieldSmallerThanAllowed(limits: ILimits): boolean {
    return areRowsSmallerThanAllowed(limits) || areColsSmallerThanAllowed(limits)
}
function areRowsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.upper.row - limits.lower.row + 1 < SMALLEST_FIELD_SIZE.row
}
function areColsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.upper.col - limits.lower.col + 1 < SMALLEST_FIELD_SIZE.col
}

function calcPureLimits(pawns: IPawn[]): ILimits {
    let firstPos = pawns[0].position;
    let initVal = <ILimits>{
        lower: {row: firstPos.row, col: firstPos.col},
        upper: {row: firstPos.row, col: firstPos.col}
    };

    return pawns.reduce((limits, pawn) => {
        // push limits if a pawn is outside current limits
        if (limits.lower.row > pawn.position.row) limits.lower.row = pawn.position.row;
        if (limits.lower.col > pawn.position.col) limits.lower.col = pawn.position.col;
        if (limits.upper.row < pawn.position.row) limits.upper.row = pawn.position.row;
        if (limits.upper.col < pawn.position.col) limits.upper.col = pawn.position.col;

        return limits
    }, initVal);
}

function increaseLimitsToMinFieldSize(limits: ILimits, oldLimits: ILimits): ILimits {
    let direction = 0;

    while (isFieldSmallerThanAllowed(limits)) {
        switch (direction % 4) {
            case 0:
                if (areRowsSmallerThanAllowed(limits) && limits.lower.row > oldLimits.lower.row)
                    limits.lower.row--;
                break;
            case 2:
                if (areRowsSmallerThanAllowed(limits) && limits.upper.row < oldLimits.upper.row)
                    limits.upper.row++;
                break;
            case 1:
                if (areColsSmallerThanAllowed(limits) && limits.lower.col > oldLimits.lower.col)
                    limits.lower.col--;
                break;
            case 3:
                if (areColsSmallerThanAllowed(limits) && limits.upper.col < oldLimits.upper.col)
                    limits.upper.col++;
                break;
        }

        direction++;
    }

    return limits;
}