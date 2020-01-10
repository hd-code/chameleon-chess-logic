import { IPawn } from "./Pawns";
import { IPosition, isPosition } from "./Position";

// -----------------------------------------------------------------------------

export interface ILimits {
    lower: IPosition
    upper: IPosition
}

export function isLimits(limits: ILimits): limits is ILimits {
    return 'lower' in limits && isPosition(limits.lower)
        && 'upper' in limits && isPosition(limits.upper)
        && !isFieldSmallerThanAllowed(limits)
}

export function isSmallestFieldSize(limits: ILimits): boolean {
    return limits.upper.row - limits.lower.row + 1 === SMALLEST_FIELD_SIZE.row
        && limits.upper.col - limits.lower.col + 1 === SMALLEST_FIELD_SIZE.col
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
        return oldLimits

    let result = calcPureLimits(pawns)
    if (!isFieldSmallerThanAllowed(result))
        return result

    // push limits step by step, while too small and not bigger than old limits
    while (areRowsSmallerThanAllowed(result) && result.lower.row > oldLimits.lower.row)
        result.lower.row--
    while (areRowsSmallerThanAllowed(result) && result.upper.row < oldLimits.upper.row)
        result.upper.row++
    while (areColsSmallerThanAllowed(result) && result.lower.col > oldLimits.lower.col)
        result.lower.col--
    while (areColsSmallerThanAllowed(result) && result.upper.col < oldLimits.upper.col)
        result.upper.col++

    return result
}

// -----------------------------------------------------------------------------

const MIN_ROW = 0, MAX_ROW = 7;
const MIN_COL = 0, MAX_COL = 7;

const SMALLEST_FIELD_SIZE = <IPosition>{ row: 3, col: 3 }

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
    let firstPos = pawns[0].position
    let initVal = <ILimits>{
        lower: {row: firstPos.row, col: firstPos.col},
        upper: {row: firstPos.row, col: firstPos.col}
    }

    return pawns.reduce((limits, pawn) => {

        // push limits if a pawn is outside current limits
        if (limits.lower.row > pawn.position.row) limits.lower.row = pawn.position.row
        if (limits.lower.col > pawn.position.col) limits.lower.col = pawn.position.col
        if (limits.upper.row < pawn.position.row) limits.upper.row = pawn.position.row
        if (limits.upper.col < pawn.position.col) limits.upper.col = pawn.position.col

        return limits
    }, initVal)
}