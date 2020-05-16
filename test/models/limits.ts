import assert from 'assert';
import * as Limits from '../../src/models/limits';

import { getPawns } from '../../src/models/pawn';

import { deepClone } from '../../lib/aux';

// -----------------------------------------------------------------------------

describe('models/limits', () => {
    const START_LIMITS = { minRow: 0, maxRow: 7, minCol: 0, maxCol: 7 };

    describe('isLimits()', () => {
        it('should return true for start limits (row: 0-7, col: 0-7)', () => {
            const limits = START_LIMITS;
            assert(Limits.isLimits(limits));
        });

        it('should return true for normal limits (row: 1-5, col: 3-7)', () => {
            const limits = { minRow: 1, maxRow: 5, minCol: 3, maxCol: 7 };
            assert(Limits.isLimits(limits));
        });

        it('should return true for 3x3 field (row: 3-5, col: 5-7)', () => {
            const limits = { minRow: 3, maxRow: 5, minCol: 5, maxCol: 7 };
            assert(Limits.isLimits(limits));
        });

        it('should return false for too small limits (row) (row: 3-4, col: 5-7)', () => {
            const limits = { minRow: 3, maxRow: 4, minCol: 5, maxCol: 7 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for too small limits (col) (row: 3-5, col: 7-7)', () => {
            const limits = { minRow: 3, maxRow: 5, minCol: 7, maxCol: 7 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for too large limits (row) (row: 0-8, col: 0-7)', () => {
            const limits = { minRow: 0, maxRow: 8, minCol: 0, maxCol: 7 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for too large limits (col) (row: 0-7, col: -1-7)', () => {
            const limits = { minRow: 0, maxRow: 7, minCol:-1, maxCol: 7 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for illogical limits (row) (row: 7-0, col: 0-7)', () => {
            const limits = { minRow: 7, maxRow: 0, minCol: 0, maxCol: 7 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for illogical limits (col) (row: 0-7, col: 7-0)', () => {
            const limits = { minRow: 0, maxRow: 7, minCol: 7, maxCol: 0 };
            assert(!Limits.isLimits(limits));
        });

        it('should return false for incomplete limits', () => {
            const DATA = [
                { minRow: 0, minCol: 0, maxRow: 7 },
                { minRow: 0, minCol: 0,            maxCol: 7 },
                { minRow: 0,            maxRow: 7, maxCol: 7 },
                {            minCol: 0, maxRow: 7, maxCol: 7 },
            ];
            DATA.forEach(limits => assert(!Limits.isLimits(limits)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!Limits.isLimits(data)));
        });
    });

    describe('isWithinLimits() – in all cases test limits are (row: 1-5, col: 3-6)', () => {
        const limits = { minRow: 1, maxRow: 5, minCol: 3, maxCol: 6 };

        it('should return true, when position (4,5) is within limits', () => {
            const position = { row: 4, col: 5 };
            assert(Limits.isWithinLimits(position, limits));
        });

        it('should return true, when position (1,3) is at the lower edge of limits', () => {
            const position = { row: 1, col: 3 };
            assert(Limits.isWithinLimits(position, limits));
        });

        it('should return true, when position (5,6) is at the upper edge of limits', () => {
            const position = { row: 5, col: 6 };
            assert(Limits.isWithinLimits(position, limits));
        });

        it('should return false, when position\'s row (0,6) is too low for limits', () => {
            const position = { row: 0, col: 6 };
            assert(!Limits.isWithinLimits(position, limits));
        });

        it('should return false, when position\'s row (7,6) is too high for limits', () => {
            const position = { row: 7, col: 6 };
            assert(!Limits.isWithinLimits(position, limits));
        });

        it('should return false, when position\'s col (5,0) is too low for limits', () => {
            const position = { row: 5, col: 0 };
            assert(!Limits.isWithinLimits(position, limits));
        });

        it('should return false, when position\'s col (5,7) is too high for limits', () => {
            const position = { row: 5, col: 7 };
            assert(!Limits.isWithinLimits(position, limits));
        });

        it('should return false, when position (0,7) is completely of limits', () => {
            const position = { row: 0, col: 7 };
            assert(!Limits.isWithinLimits(position, limits));
        });
    });

    describe('isSmallestLimits()', () => {
        it('should return true for 3x3 field (row: 3-5, col: 5-7)', () => {
            const limits = { minRow: 3, maxRow: 5, minCol: 5, maxCol: 7 };
            assert(Limits.isSmallestLimits(limits));
        });

        it('should return true for 3x3 field (row: 0-2, col: 0-2)', () => {
            const limits = { minRow: 0, maxRow: 2, minCol: 0, maxCol: 2 };
            assert(Limits.isSmallestLimits(limits));
        });

        it('should return false for start limits (row: 0-7, col: 0-7)', () => {
            const limits = START_LIMITS;
            assert(!Limits.isSmallestLimits(limits));
        });

        it('should return false for non-smallest limits (row: 1-5, col: 3-7)', () => {
            const limits = { minRow: 1, maxRow: 5, minCol: 3, maxCol: 7 };
            assert(!Limits.isSmallestLimits(limits));
        });

        it('should return false even when only rows are greater (row: 1-5, col: 0-2)', () => {
            const limits = { minRow: 1, maxRow: 5, minCol: 0, maxCol: 2 };
            assert(!Limits.isSmallestLimits(limits));
        });

        it('should return false even when only cols are greater (row: 3-5, col: 1-4)', () => {
            const limits = { minRow: 3, maxRow: 5, minCol: 1, maxCol: 4 };
            assert(!Limits.isSmallestLimits(limits));
        });
    });

    describe('getStartLimits()', () => {
        it('should return limits with 0 for min row and col and 7 for max row and col', () => {
            const actual = Limits.getStartLimits();
            assert.strictEqual(actual.minRow, START_LIMITS.minRow);
            assert.strictEqual(actual.maxRow, START_LIMITS.maxRow);
            assert.strictEqual(actual.minCol, START_LIMITS.minCol);
            assert.strictEqual(actual.maxCol, START_LIMITS.maxCol);
        });
    });

    describe('calcLimits()', () => {
        const PAWNS_RED = getPawns(0);
        const PAWNS_GREEN = getPawns(1);
        const PAWNS_YELLOW = getPawns(2);
        const PAWNS_BLUE = getPawns(3);

        it('should not shrink limits, when all pawns still are at the edge of the board', () => {
            const expected = START_LIMITS;
            const pawns = [...PAWNS_RED, ...PAWNS_GREEN, ...PAWNS_YELLOW, ...PAWNS_BLUE];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should shrink from start limits to (row: 0-3, col: 0-7) when only yellow and blue are present', () => {
            const expected = { minRow: 0, maxRow: 3, minCol: 0, maxCol: 7 };
            const pawns = [...PAWNS_YELLOW, ...PAWNS_BLUE];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should shrink from start limits to (row: 0-7, col: 4-7) when only yellow and green are present', () => {
            const expected = { minRow: 0, maxRow: 7, minCol: 4, maxCol: 7 };
            const pawns = [...PAWNS_GREEN, ...PAWNS_YELLOW];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should shrink from start limits to (row: 5-7, col: 0-3) when only red pawns are present', () => {
            const expected = { minRow: 5, maxRow: 7, minCol: 0, maxCol: 3 };
            const pawns = [...PAWNS_RED];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should shrink from start limits to (row: 5-7, col: 5-7) when only one pawn at (7,7)', () => {
            const expected = { minRow: 5, maxRow: 7, minCol: 5, maxCol: 7 };
            const pawns = [PAWNS_GREEN[0]];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should shrink from start limits to (row: 3-5, col: 4-6) when only one pawn at (4,5)', () => {
            const expected = { minRow: 3, maxRow: 5, minCol: 4, maxCol: 6 };
            let pawn = deepClone(PAWNS_RED[0]);
            pawn.position = { row: 4, col: 5 };
            const pawns = [pawn];
            const actual = Limits.calcLimits(pawns, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });
    });
});