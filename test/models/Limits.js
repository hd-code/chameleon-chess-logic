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
            const TOO_BIG_LIMITS     = { lower:{row:-1,col:0}, upper:{row:8,col:9} };
            const TOO_BIG_LIMITS_ROW = { lower:{row: 0,col:0}, upper:{row:8,col:7} };
            const TOO_BIG_LIMITS_COL = { lower:{row: 0,col:0}, upper:{row:7,col:9} };

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
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Limits.isLimits(DIFF_OBJ));
            assert.ok(!Limits.isLimits(DIFF_ARR));
            assert.ok(!Limits.isLimits(' '));
            assert.ok(!Limits.isLimits(true));
            assert.ok(!Limits.isLimits(null));
            assert.ok(!Limits.isLimits());
        });
    });

    describe('isPositionWithinLimits()', () => {
        const CENTER_POS = { row: 3, col: 4 };
        const EDGE_POS_TR = { row: 0, col: 7 };
        const EDGE_POS_BL = { row: 7, col: 0 };

        const POS_OUT_OF_BOUNCE_POS = { row: 9, col: 8 };
        const POS_OUT_OF_BOUNCE_NEG = { row:-5, col:-3 };
        const POS_OUT_OF_BOUNCE_BOTH = { row:-1, col: 9 };

        it('should return true if a position is within the limits', () => {
            assert.ok(Limits.isPositionWithinLimits(CENTER_POS, NORMAL_LIMITS));
            assert.ok(Limits.isPositionWithinLimits(CENTER_POS, START_LIMITS));
            assert.ok(Limits.isPositionWithinLimits(EDGE_POS_TR, START_LIMITS));
            assert.ok(Limits.isPositionWithinLimits(EDGE_POS_BL, START_LIMITS));
        });

        it('should return false if a position is not within the limits', () => {
            assert.ok(!Limits.isPositionWithinLimits(EDGE_POS_TR, NORMAL_LIMITS));
            assert.ok(!Limits.isPositionWithinLimits(EDGE_POS_BL, NORMAL_LIMITS));

            assert.ok(!Limits.isPositionWithinLimits(POS_OUT_OF_BOUNCE_POS, START_LIMITS));
            assert.ok(!Limits.isPositionWithinLimits(POS_OUT_OF_BOUNCE_NEG, START_LIMITS));
            assert.ok(!Limits.isPositionWithinLimits(POS_OUT_OF_BOUNCE_BOTH, START_LIMITS));
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

    describe('getStartingLimits()', () => {
        it('should return correct starting limit (0,0 7,7)', () => {
            const actual = Limits.getStartingLimits();
            assert.deepStrictEqual(actual, START_LIMITS);
        });
    });

    // TEST CASES!!!
    describe('calcLimits()', () => {
        const EDGE_PAWN_TR = [{
            player:  0,
            roles:   {0:0, 1:1, 2:2, 3:3},
            position:{ row: 0, col: 7 }
        }];
        const EDGE_PAWN_BL = [{
            player:  1,
            roles:   {0:0, 1:1, 2:2, 3:3},
            position:{ row: 7, col: 0 }
        }];
        const EDGE_PAWNS = [EDGE_PAWN_TR[0], EDGE_PAWN_BL[0]];

        const CENTER_PAWN_TL = [{
            player:  0,
            roles:   {0:0, 1:1, 2:2, 3:3},
            position:{ row: 3, col: 3 }
        }];
        const CENTER_PAWN_BR = [{
            player:  1,
            roles:   {0:0, 1:1, 2:2, 3:3},
            position:{ row: 5, col: 6 }
        }];
        const CENTER_PAWNS = [CENTER_PAWN_TL[0], CENTER_PAWN_BR[0]];

        it('should return shrunken limits (3,3 5,6)', () => {
            const expected = { lower:{row:3,col:3}, upper:{row:5,col:6} };
            const actual = Limits.calcLimits(CENTER_PAWNS, START_LIMITS);
            assert.deepStrictEqual(actual, expected);
        });

        it('should not shrink limits if pawns are on the edges', () => {
            const actual = Limits.calcLimits(EDGE_PAWNS, START_LIMITS);
            assert.deepStrictEqual(actual,START_LIMITS);
        });

        it('should only shrink limits until a 3x3 field remains on the edges', () => {
            const SMALLEST_EDGE_LIMITS_TR = { lower:{row:0,col:5}, upper:{row:2,col:7} };
            const SMALLEST_EDGE_LIMITS_BL = { lower:{row:5,col:0}, upper:{row:7,col:2} };

            const actualTR = Limits.calcLimits(EDGE_PAWN_TR, START_LIMITS);
            const actualBL = Limits.calcLimits(EDGE_PAWN_BL, START_LIMITS);

            assert.deepStrictEqual(actualTR,SMALLEST_EDGE_LIMITS_TR);
            assert.deepStrictEqual(actualBL,SMALLEST_EDGE_LIMITS_BL);
        });

        it('should only shrink limits until a 3x3 field and should keep pawns centered inside', () => {
            const SMALLEST_CENTER_LIMITS_TL = { lower:{row:2,col:2}, upper:{row:4,col:4} };
            const SMALLEST_CENTER_LIMITS_BR = { lower:{row:4,col:5}, upper:{row:6,col:7} };

            const actualTL = Limits.calcLimits(CENTER_PAWN_TL, START_LIMITS);
            const actualBR = Limits.calcLimits(CENTER_PAWN_BR, START_LIMITS);

            assert.deepStrictEqual(actualTL,SMALLEST_CENTER_LIMITS_TL);
            assert.deepStrictEqual(actualBR,SMALLEST_CENTER_LIMITS_BR);
        });
    });
});