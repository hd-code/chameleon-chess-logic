import { isInteger, hasKey } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * An enum, which represents the four colors a field on the board can have.
 * - RED: 0
 * - GREEN: 1
 * - YELLOW: 2
 * - BLUE: 3
 */
export enum EFieldColor { RED, GREEN, YELLOW, BLUE }

/** Type guard for `EFieldColor`. */
export function isFieldColor(fieldColor: any): fieldColor is EFieldColor {
    return isInteger(fieldColor) && EFieldColor[fieldColor] !== undefined;
}

/** Returns the color of the field on the game board at a given position. */
export function getFieldColor(position: IPosition): EFieldColor {
    return getBoard()[position.row][position.col];
}

// -----------------------------------------------------------------------------

/**
 * Returns the game board, which is a two-dimensional array of `EFieldColor`s.
 * 
 * A position on the board is given by a `row` and a `col` entry.  `row` is the
 * first dimension of the array and `col` the second.
 * @see IPosition
 * 
 * This board layout never changes. So, it is sufficient to call this function
 * once on application startup and store the board in a constant.
 */
export function getBoard(): EFieldColor[][] {
    return BOARD;
}

/** Returns the number of rows and columns of the game board. */
export function getBoardSize() {
    return {
        numOfRows: BOARD.length,
        numOfCols: BOARD[0].length
    };
}

// -----------------------------------------------------------------------------

/**
 * Specifies a field on the game board. A field is located at a certain row and
 * at a certain column.
 * 
 * Therefore, an `IPosition` has two properties:
 * - `row`: the row    of the field on the game board
 * - `col`: the column of the field on the game board
 * 
 * There are 8 rows and 8 columns, they are indexed by positive whole numbers
 * (0 to 7). So, they are zero-based.
 */
export interface IPosition {
    /** the row of the field on the game board */
    row: number;
    /** the column of the field on the game board */
    col: number;
}


/** Type guard for `IPosition`. */
export function isPosition(position: any): position is IPosition {
    const boardSize = getBoardSize();
    return hasKey(position, 'row', isInteger) && position.row >= 0 && position.row < boardSize.numOfRows
        && hasKey(position, 'col', isInteger) && position.col >= 0 && position.col < boardSize.numOfCols;
}

/**
 * Checks if two positions are the same. So, if they point to the same field on
 * the board. If so, the function returns true, false if not.
 */
export function isSamePosition(a: IPosition, b: IPosition): boolean {
    return a.row === b.row && a.col === b.col;
}

/**
 * Searches an array of positions for a particular position. If that position is
 * found in the array (so, there is an entry that points to the same field on
 * the board), than the function returns true, false otherwise.
 * @param position  The position that the array should be searched for.
 * @param positions The array of positions to be searched.
 */
export function isInPositions(postion: IPosition, positions: IPosition[]): boolean {
    for (let i = 0, ie = positions.length; i < ie; i++) {
        if (isSamePosition(postion, positions[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Sorting function to be used in `[].sort()`. It sorts an array of positions by
 * `position.row` ascending. If rows are equal, entries are then sorted by
 * `position.col` ascending.
 */
export function sortPositions(a: IPosition, b: IPosition): number {
    return a.row !== b.row ? a.row - b.row : a.col - b.col;
}

// -----------------------------------------------------------------------------

const [R,G,Y,B] = [EFieldColor.RED, EFieldColor.GREEN, EFieldColor.YELLOW, EFieldColor.BLUE]
const BOARD: EFieldColor[][] = [
    [B, R, B, Y, G, R, B, Y],
    [R, G, R, B, Y, G, R, B],
    [G, Y, R, G, R, B, B, Y],
    [Y, B, G, Y, G, R, Y, G],
    [B, R, Y, B, R, B, G, R],
    [R, G, G, Y, B, Y, R, B],
    [G, Y, B, R, G, Y, B, Y],
    [R, G, Y, B, R, G, Y, G]
];