const Assert = require('assert');
const Position = require('../../build/models/Position.js');

// -----------------------------------------------------------------------------

describe('models/Position', () => {
    const TEST_POS = {row: 1, col: 3};

    describe('isPosition()', () => {
        const POS_NO_ROW = {col: 3};
        const POS_NO_COL = {row: 1};
        const DIFF_OBJ   = {street: 'Baker Street', houseNo: 2};
        const DIFF_TYPE  = [1,2,3,4];

        it('should return true if position is valid', () => {
            Assert.ok(Position.isPosition(TEST_POS));
        });

        it('should return false if position is invalid', () => {
            Assert.ok(!Position.isPosition(POS_NO_ROW));
            Assert.ok(!Position.isPosition(POS_NO_COL));
            Assert.ok(!Position.isPosition(DIFF_OBJ));
            Assert.ok(!Position.isPosition(DIFF_TYPE));
        });
    });
    describe('isSamePosition()', () => {
        const SAME_POS = {row: 1, col: 3};
        const DIFF_POS = {row: 2, col: 4};
        const DIFF_POS_ROW = {row: 2, col: 3};
        const DIFF_POS_COL = {row: 1, col: 4};

        it('should return true for matching positions', () => {
            Assert.ok(Position.isSamePosition(TEST_POS, SAME_POS));
        });

        it('should return false for miss-matching positions', () => {
            Assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS));
            Assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS_ROW));
            Assert.ok(!Position.isSamePosition(TEST_POS, DIFF_POS_COL));
        });
    });
    describe('isPositionInPositions()', () => {
        const ARRAY_WITH_POS = [ {row: 1,col:1}, {row: 1,col:2}, {row: 1,col:3} ];
        const ARRAY_WITHOUT  = [ {row: 2,col:1}, {row: 2,col:2}, {row: 2,col:3} ];

        it('should return true if the position is also in the array', () => {
            Assert.ok(Position.isPositionInPositions(TEST_POS, ARRAY_WITH_POS));
        });

        it('should return false if the position is not in the array', () => {
            Assert.ok(!Position.isPositionInPositions(TEST_POS, ARRAY_WITHOUT));
        });
    });
});