import { IPosition, isPosition } from "./basic";
import { IPawn } from "./pawns";

/* --------------------------------- Public --------------------------------- */

export interface ILimits {
    lower: IPosition
    upper: IPosition
}

export function isLimits(limits: ILimits): limits is ILimits {
    return 'lower' in limits && isPosition(limits.lower)
        && 'upper' in limits && isPosition(limits.upper)
}

export const STARTING_LIMITS = <ILimits>{
    lower: {row: 0, col: 0},
    upper: {row: 7, col: 7}
}

export function isWithinLimits(pos: IPosition, limits: ILimits): boolean {
    return limits.lower.row <= pos.row &&  pos.row <= limits.upper.row
        && limits.lower.col <= pos.col &&  pos.col <= limits.upper.col
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

/* --------------------------------- Intern --------------------------------- */

const SMALLEST_FIELD_SIZE = <IPosition>{ row: 3, col: 3 }

function isSmallestFieldSize(limits: ILimits): boolean {
    return limits.upper.row - limits.lower.row + 1 === SMALLEST_FIELD_SIZE.row
        && limits.upper.col - limits.lower.col + 1 === SMALLEST_FIELD_SIZE.col
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

function isFieldSmallerThanAllowed(limits: ILimits): boolean {
    return areRowsSmallerThanAllowed(limits) || areColsSmallerThanAllowed(limits)
}

function areRowsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.upper.row - limits.lower.row + 1 < SMALLEST_FIELD_SIZE.row
}

function areColsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.upper.col - limits.lower.col + 1 < SMALLEST_FIELD_SIZE.col
}