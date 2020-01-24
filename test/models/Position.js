const assert = require('assert');
const Position = require('../../build/models/Position.js');

// -----------------------------------------------------------------------------

describe('models/Position', () => {
    const TEST_POS = {row: 1, col: 3};

    describe('isPosition()', () => {
        it('should return true if position is valid', () => {
            assert.ok(Position.isPosition(TEST_POS));
        });

        it('should return false if position is incomplete', () => {
            const POS_NO_ROW = {col: 3};
            const POS_NO_COL = {row: 1};

            assert.ok(!Position.isPosition(POS_NO_ROW));
            assert.ok(!Position.isPosition(POS_NO_COL));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Position.isPosition(DIFF_OBJ));
            assert.ok(!Position.isPosition(DIFF_ARR));
            assert.ok(!Position.isPosition(' '));
            assert.ok(!Position.isPosition(true));
            assert.ok(!Position.isPosition(null));
            assert.ok(!Position.isPosition());
        });
    });
    describe('isSamePosition()', () => {
        const SAME_POS = {row: 1, col: 3};
        const DIFF_POS = {row: 2, col: 4};
        const DIFF_POS_ROW = {row: 2, col: 3};
        const DIFF_POS_COL = {row: 1, col: 4};

        it('should return true for matching positions', () => {
            assert.ok(Position.isSamePosition(TEST_POS, SAME_POS));
        });

        it('should return false for miss-matching positions', () => {
            assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS));
            assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS_ROW));
            assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS_COL));
        });
    });
    describe('isPositionInPositions()', () => {
        const ARRAY_WITH_POS = [ {row: 1,col:1}, {row: 1,col:2}, TEST_POS ];
        const ARRAY_WITHOUT  = [ {row: 2,col:1}, {row: 2,col:2}, {row: 2,col:3} ];

        it('should return true if the position is also in the array', () => {
            assert.ok(Position.isPositionInPositions(TEST_POS, ARRAY_WITH_POS));
        });

        it('should return false if the position is not in the array', () => {
            assert.ok(!Position.isPositionInPositions(TEST_POS, ARRAY_WITHOUT));
        });
    });
});