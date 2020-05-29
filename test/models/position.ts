import assert from 'assert';
import * as Position from '../../src/models/position';

import { IPosition } from '../../src/types';
import { deepClone } from '../../lib/aux';

// -----------------------------------------------------------------------------

describe('models/board', () => {
    const TEST_POS1: IPosition = { row: 1, col: 3 };
    const TEST_POS2: IPosition = { row: 0, col: 0 };
    const TEST_POS3: IPosition = { row: 7, col: 5 };

    describe('isPosition()', () => {
        it('should return true for the three test positions', () => {
            assert(Position.isPosition(TEST_POS1));
            assert(Position.isPosition(TEST_POS2));
            assert(Position.isPosition(TEST_POS3));
        });

        it('should return false for incomplete positions', () => {
            const testData = [
                {         col: 3 },
                { row: 1         }
            ];
            testData.forEach(data => assert(!Position.isPosition(data)));
        });

        it('should return false for positions with decimals' , () => {
            const testData = [
                { row: 1.5, col: 3   },
                { row: 1  , col: 3.2 },
                { row: 1.5, col: 3.2 }
            ];
            testData.forEach(data => assert(!Position.isPosition(data)));
        });

        it('should return false for positions with negative values' , () => {
            const testData = [
                { row:-1, col: 3 },
                { row: 1, col:-3 },
                { row:-1, col:-3 }
            ];
            testData.forEach(data => assert(!Position.isPosition(data)));
        });

        it('should return false for positions with too high values (>7)' , () => {
            const testData = [
                { row:10, col: 3 },
                { row: 1, col:30 },
                { row:10, col:30 }
            ];
            testData.forEach(data => assert(!Position.isPosition(data)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const testData = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            testData.forEach(data => assert(!Position.isPosition(data)));
        });
    });

    describe('isSamePosition()', () => {
        it('should return true, when both positions are the same object', () => {
            assert(Position.isSamePosition(TEST_POS1, TEST_POS1));
            assert(Position.isSamePosition(TEST_POS2, TEST_POS2));
            assert(Position.isSamePosition(TEST_POS3, TEST_POS3));
        });

        it('should return true, when both positions have the same values', () => {
            assert(Position.isSamePosition(TEST_POS1, {...TEST_POS1}));
            assert(Position.isSamePosition(TEST_POS2, {...TEST_POS2}));
            assert(Position.isSamePosition(TEST_POS3, {...TEST_POS3}));
        });

        it('should return false, when the positions have different values', () => {
            assert(!Position.isSamePosition(TEST_POS1, TEST_POS2));
            assert(!Position.isSamePosition(TEST_POS2, TEST_POS3));
            assert(!Position.isSamePosition(TEST_POS3, TEST_POS2));
        });
    });

    describe('isInPositions()', () => {
        it('should return true, when the position is also in the array', () => {
            const positions = [ TEST_POS1, TEST_POS2, TEST_POS3 ];
            assert(Position.isInPositions(TEST_POS1, positions));
            assert(Position.isInPositions(TEST_POS2, positions));
            assert(Position.isInPositions(TEST_POS3, positions));
        });

        it('should return true, when the position has the same values as one in the array', () => {
            const positions = [ TEST_POS1, TEST_POS2, TEST_POS3 ];
            assert(Position.isInPositions({...TEST_POS1}, positions));
            assert(Position.isInPositions({...TEST_POS2}, positions));
            assert(Position.isInPositions({...TEST_POS3}, positions));
        });

        it('should return false, when the position does not match any one in the array', () => {
            assert(!Position.isInPositions(TEST_POS1, [TEST_POS2, TEST_POS3]));
            assert(!Position.isInPositions(TEST_POS2, [TEST_POS1, TEST_POS3]));
            assert(!Position.isInPositions(TEST_POS3, [TEST_POS1, TEST_POS2]));
        });

        it('should return false for an empty array', () => {
            assert(!Position.isInPositions(TEST_POS1, []));
            assert(!Position.isInPositions(TEST_POS2, []));
            assert(!Position.isInPositions(TEST_POS3, []));
        });
    });

    describe('sortPositions()', () => {
        it('should sort positions by row ascending and by col ascending when rows are equal', () => {
            const expected = [
                { row: 0, col: 0 },
                { row: 0, col: 1 },
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 1, col: 5 },
                { row: 1, col: 7 },
                { row: 6, col: 1 },
                { row: 6, col: 2 },
            ];
            
            let actual = [
                { row: 6, col: 1 },
                { row: 0, col: 0 },
                { row: 0, col: 2 },
                { row: 0, col: 1 },
                { row: 6, col: 2 },
                { row: 1, col: 7 },
                { row: 0, col: 1 },
                { row: 1, col: 5 },
            ];
            actual.sort(Position.sortPositions);

            assert.deepStrictEqual(actual, expected);
        });
    });
});