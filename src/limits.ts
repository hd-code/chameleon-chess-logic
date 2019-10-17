import { ILimits, IPosition, IMeeple } from "./main";
import { isPosition } from "./helperAdv";

/* --------------------------------- Public --------------------------------- */

export function isLimits(limits :ILimits) :limits is ILimits {
    return 'lower' in limits && isPosition(limits.lower)
        && 'upper' in limits && isPosition(limits.upper)
}

export const STARTING_LIMITS :ILimits = {
    lower: {row: 0, col: 0},
    upper: {row: 7, col: 7}
}

export function isWithinLimits(pos :IPosition, limits :ILimits) :boolean {
    return limits.lower.row <= pos.row &&  pos.row <= limits.upper.row
        && limits.lower.col <= pos.col &&  pos.col <= limits.upper.col
}

export function calcLimits(meeples:IMeeple[], oldLimits:ILimits) :ILimits {
    if (isSmallestFieldSize(oldLimits))
        return oldLimits

    let result = calcPureLimits(meeples)
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

const SMALLEST_FIELD_SIZE :IPosition = {
    row: 3,
    col: 3
}

function isSmallestFieldSize(limits :ILimits) :boolean {
    return limits.upper.row - limits.lower.row + 1 === SMALLEST_FIELD_SIZE.row
        && limits.upper.col - limits.lower.col + 1 === SMALLEST_FIELD_SIZE.col
}

function calcPureLimits(meeples :IMeeple[]) :ILimits {
    let firstPos = meeples[0].position
    let initVal:ILimits = {
        lower: {row: firstPos.row, col: firstPos.col},
        upper: {row: firstPos.row, col: firstPos.col}
    }

    return meeples.reduce((limits, meeple) => {

        // push limits if a meeple is outside current limits
        if (limits.lower.row > meeple.position.row) limits.lower.row = meeple.position.row
        if (limits.lower.col > meeple.position.col) limits.lower.col = meeple.position.col
        if (limits.upper.row < meeple.position.row) limits.upper.row = meeple.position.row
        if (limits.upper.col < meeple.position.col) limits.upper.col = meeple.position.col

        return limits
    }, initVal)
}

function isFieldSmallerThanAllowed(limits :ILimits) :boolean {
    return areRowsSmallerThanAllowed(limits) || areColsSmallerThanAllowed(limits)
}

function areRowsSmallerThanAllowed(limits :ILimits) :boolean {
    return limits.upper.row - limits.lower.row + 1 < SMALLEST_FIELD_SIZE.row
}

function areColsSmallerThanAllowed(limits :ILimits) :boolean {
    return limits.upper.col - limits.lower.col + 1 < SMALLEST_FIELD_SIZE.col
}