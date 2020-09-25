import { hasKey } from '../../lib/obray';

import { ILimits, IPawn, IPosition } from '../types';
import { getBoardSize } from './board';

// -----------------------------------------------------------------------------

/** Type guard for `ILimits`. Checks types and validity according to the game rules. */
export function isLimits(limits: any): limits is ILimits {
    return hasKey(limits, 'minRow')
        && hasKey(limits, 'maxRow')
        && hasKey(limits, 'minCol')
        && hasKey(limits, 'maxCol')
        && !isLimitsSmallerThanAllowed(limits)
        && !isLimitsGreaterThanAllowed(limits);
}

export function isWithinLimits(position: IPosition, limits: ILimits): boolean {
    return limits.minRow <= position.row && position.row <= limits.maxRow
        && limits.minCol <= position.col && position.col <= limits.maxCol;
}

/** Returns true if the limits have reach the smallest possible size of 3x3. */
export function isSmallestLimits(limits: ILimits): boolean {
    return limits.maxRow - limits.minRow === MIN_DIFF_BETWEEN_MIN_MAX
        && limits.maxCol - limits.minCol === MIN_DIFF_BETWEEN_MIN_MAX;
}

export function getStartLimits(): ILimits {
    const boardSize = getBoardSize();
    return {
        minRow: 0, maxRow: boardSize.numOfRows - 1,
        minCol: 0, maxCol: boardSize.numOfCols - 1,
    };
}

/** Updates (shrinks) the limits, when a move was made. Needs the updated
 * (moved) pawns to perform the calculation. */
export function calcLimits(pawns: IPawn[], oldLimits: ILimits): ILimits {
    if (isSmallestLimits(oldLimits)) return oldLimits;

    const limits = calcPureLimits(pawns);
    return isLimitsSmallerThanAllowed(limits) ? increaseToMinSize(limits, oldLimits) : limits;
}

// -----------------------------------------------------------------------------

const MIN_DIFF_BETWEEN_MIN_MAX = 2;

function isLimitsGreaterThanAllowed(limits: ILimits): boolean {
    const boardSize = getBoardSize();
    return limits.maxRow - limits.minRow >= boardSize.numOfRows
        || limits.maxCol - limits.minCol >= boardSize.numOfCols;
}

function isLimitsSmallerThanAllowed(limits: ILimits): boolean {
    return isRowsSmallerThanAllowed(limits) || isColsSmallerThanAllowed(limits);
}

function isRowsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.maxRow - limits.minRow < MIN_DIFF_BETWEEN_MIN_MAX;
}

function isColsSmallerThanAllowed(limits: ILimits): boolean {
    return limits.maxCol - limits.minCol < MIN_DIFF_BETWEEN_MIN_MAX;
}

function calcPureLimits(pawns: IPawn[]): ILimits {
    const result = {
        minRow: pawns[0].position.row, maxRow: pawns[0].position.row,
        minCol: pawns[0].position.col, maxCol: pawns[0].position.col,
    };

    for (let i = 1, ie = pawns.length; i < ie; i++) {
        if (result.minRow > pawns[i].position.row) result.minRow = pawns[i].position.row;
        if (result.maxRow < pawns[i].position.row) result.maxRow = pawns[i].position.row;
        if (result.minCol > pawns[i].position.col) result.minCol = pawns[i].position.col;
        if (result.maxCol < pawns[i].position.col) result.maxCol = pawns[i].position.col;
    }

    return result;
}

function increaseToMinSize(limits: ILimits, oldLimits: ILimits): ILimits {

    while (isLimitsSmallerThanAllowed(limits)) {

        if (isRowsSmallerThanAllowed(limits) && limits.minRow > oldLimits.minRow) {
            limits.minRow -= 1;
        }

        if (isRowsSmallerThanAllowed(limits) && limits.maxRow < oldLimits.maxRow) {
            limits.maxRow += 1;
        }

        if (isColsSmallerThanAllowed(limits) && limits.minCol > oldLimits.minCol) {
            limits.minCol -= 1;
        }

        if (isColsSmallerThanAllowed(limits) && limits.maxCol < oldLimits.maxCol) {
            limits.maxCol += 1;
        }
    }

    return limits;
}