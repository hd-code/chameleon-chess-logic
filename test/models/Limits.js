const assert = require('assert');
const Limits = require('../../build/models/Limits.js');

// -----------------------------------------------------------------------------

describe('models/Limits', () => {
    const START_LIMITS = { lower:{row:0,col:0}, upper:{row:7,col:7} };
    const NORMAL_LIMITS = { lower:{row:1,col:2}, upper:{row:6,col:5} };
    const SMALL_LIMITS = { lower:{row:3,col:5}, upper:{row:5,col:7} };
    const TOO_SMALL_LIMITS = { lower:{row:4,col:2}, upper:{row:5,col:2}};
    const TOO_SMALL_LIMITS_ROW = { lower:{row:4,col:2}, upper:{row:5,col:4}};
    const TOO_SMALL_LIMITS_COL = { lower:{row:4,col:2}, upper:{row:6,col:2}};

    describe('isLimits()', () => {
        it('should return true for valid limits (starting, normal, smallest)', () => {
            assert.ok(Limits.isLimits(START_LIMITS));
            assert.ok(Limits.isLimits(NORMAL_LIMITS));
            assert.ok(Limits.isLimits(SMALL_LIMITS));
        });

        it('should return false for invalid limits (too small, too large)', () => {
            const TOO_BIG_LIMITS = { lower:{row:-1,col:0}, upper:{row:8,col:9}};
            const TOO_BIG_LIMITS_ROW = { lower:{row:0,col:0}, upper:{row:8,col:7}};
            const TOO_BIG_LIMITS_COL = { lower:{row:0,col:0}, upper:{row:7,col:9}};

            assert.ok(!Limits.isLimits(TOO_SMALL_LIMITS));
            assert.ok(!Limits.isLimits(TOO_SMALL_LIMITS_COL));
            assert.ok(!Limits.isLimits(TOO_SMALL_LIMITS_ROW));

            assert.ok(!Limits.isLimits(TOO_BIG_LIMITS));
            assert.ok(!Limits.isLimits(TOO_BIG_LIMITS_COL));
            assert.ok(!Limits.isLimits(TOO_BIG_LIMITS_ROW));
        });

        it('should return false for incomplete limits', () => {
            const LIMITS_NO_UPPER = { lower:{row:0,col:0} };
            const LIMITS_NO_LOWER = { upper:{row:7,col:7} };
            const LIMITS_NO_ROWS  = { lower:{col:0}, upper:{col:7} };
            const LIMITS_NO_COLS  = { lower:{row:0}, upper:{row:7} };

            assert.ok(!Limits.isLimits(LIMITS_NO_UPPER));
            assert.ok(!Limits.isLimits(LIMITS_NO_LOWER));
            assert.ok(!Limits.isLimits(LIMITS_NO_ROWS));
            assert.ok(!Limits.isLimits(LIMITS_NO_COLS));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ  = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR  = [1,2,3,4];

            assert.ok(!Limits.isLimits(DIFF_OBJ));
            assert.ok(!Limits.isLimits(DIFF_ARR));
            assert.ok(!Limits.isLimits(' '));
            assert.ok(!Limits.isLimits(true));
            assert.ok(!Limits.isLimits(null));
            assert.ok(!Limits.isLimits());
        });
    });

    describe('isSmallestFieldSize()', () => {
        it('should return true for 3x3 field', () => {
            assert.ok(Limits.isSmallestFieldSize(SMALL_LIMITS));
        });

        it('should return false for bigger field', () => {
            assert.ok(!Limits.isSmallestFieldSize(START_LIMITS));
        });

        it('should return false for too small fields', () => {
            assert.ok(!Limits.isSmallestFieldSize(TOO_SMALL_LIMITS));
            assert.ok(!Limits.isSmallestFieldSize(TOO_SMALL_LIMITS_ROW));
            assert.ok(!Limits.isSmallestFieldSize(TOO_SMALL_LIMITS_COL));
        });
    });

    // TODO
    describe('isPositionWithinLimits()', () => {});

    describe('getStartingLimits()', () => {
        it('should return correct starting limit (0,0 7,7)', () => {
            const actual = Limits.getStartingLimits();
            assert.deepStrictEqual(actual, START_LIMITS);
        });
    });

    // TODO
    describe('calcLimits()', () => {});
});