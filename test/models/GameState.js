const assert = require('assert');
const GameState = require('../../build/models/GameState.js');

// -----------------------------------------------------------------------------

describe('models/GameState', () => {
    // TODO
    describe('isGameState()', () => {

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!GameState.isGameState(DIFF_OBJ));
            assert.ok(!GameState.isGameState(DIFF_ARR));
            assert.ok(!GameState.isGameState(' '));
            assert.ok(!GameState.isGameState(true));
            assert.ok(!GameState.isGameState(null));
            assert.ok(!GameState.isGameState());
        });
    });

    // TODO
    describe('isGameOver()', () => {});

    // TODO
    describe('isPlayerAlive()', () => {});

    // TODO
    describe('isValidMove()', () => {});

    // TODO
    describe('initGameState()', () => {});

    // TODO
    describe('makeMove()', () => {});

    // TODO
    describe('getNextPossibleGameStates()', () => {});
});