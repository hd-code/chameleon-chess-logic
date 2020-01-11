const assert = require('assert');
const Pawns = require('../../build/models/Pawns.js');

// -----------------------------------------------------------------------------

describe('models/Pawns', () => {
    // TODO
    describe('isPawn()', () => {
        
        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Pawns.isPawn(DIFF_OBJ));
            assert.ok(!Pawns.isPawn(DIFF_ARR));
            assert.ok(!Pawns.isPawn(' '));
            assert.ok(!Pawns.isPawn(true));
            assert.ok(!Pawns.isPawn(null));
            assert.ok(!Pawns.isPawn());
        });
    });

    // TODO
    describe('areAllPawnsWithinLimits()', () => {});

    // TODO
    describe('areTherePawnsOnTheSameField()', () => {});

    // TODO
    describe('getDefaultPawnsForPlayer()', () => {});

    // TODO
    describe('getPawnAtPosition()', () => {});

    // TODO
    describe('getIndexOfPawn()', () => {});

    // TODO
    describe('getIndexOfPawnAtPosition()', () => {});

    // TODO
    describe('getNextMoves()', () => {});
});