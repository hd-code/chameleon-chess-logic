import { getBoardSize, IPosition } from './board';
import { IPawn } from './pawn';

import { hasKey } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * The board shrinks during the course of the game. This data structure will
 * store the current min and max values of the rows and the columns. So the
 * current board size and what fields still belong to the game, can be retrieved
 * from this data structure.
 * 
 * It has the following properties:
 * - `minRow`: the lowest row, that is still part of the game
 * - `maxRow`: the highest row, that is still part of the game
 * - `minCol`: the lowest column, that is still part of the game
 * - `maxCol`: the highest column, that is still part of the game
 * 
 * _Important_: these properties are 'including'. So, `minRow: 1` means that the
 * rows with an index of **1 or higher** are still part of the game.
 */
export interface ILimits {
    /** the lowest row, that is still part of the game */
    minRow: number;
    /** the highest row, that is still part of the game */
    maxRow: number;
    /** the lowest column, that is still part of the game */
    minCol: number;
    /** the highest column, that is still part of the game */
    maxCol: number;
}

/** Type guard for `ILimits`. Checks types and validity according to the game rules. */
export function isLimits(limits: any): limits is ILimits {
    return hasKey(limits, 'minRow')
        && hasKey(limits, 'maxRow')
        && hasKey(limits, 'minCol')
        && hasKey(limits, 'maxCol')
        && !isLimitsSmallerThanAllowed(limits)
        && !isLimitsGreaterThanAllowed(limits)
}

/** Returns true if a given position is within the limits, thus a valid
 * available field on the board. */
export function isWithinLimits(position: IPosition, limits: ILimits) {
    return limits.minRow <= position.row && position.row <= limits.maxRow
        && limits.minCol <= position.col && position.col <= limits.maxCol;
}

/** Returns true if the limits have reach the smallest possible size of 3x3. */
export function isSmallestLimits(limits: ILimits): boolean {
    return limits.maxRow - limits.minRow === MIN_DIFF_BETWEEN_MIN_MAX
        && limits.maxCol - limits.minCol === MIN_DIFF_BETWEEN_MIN_MAX;
}

/** Returns the initial limits, when the board has not yet shrunken. */
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
    let result = {
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