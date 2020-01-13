const assert = require('assert');
const GameState = require('../../build/models/GameState.js');

const Color = require('../../build/models/Color.js');
const Limits = require('../../build/models/Limits.js');

// -----------------------------------------------------------------------------

describe('models/GameState', () => {
    const GS_START_4_PLAYERS = GameState.initGameState(true, true, true, true);
    const GS_START_2_PLAYERS = GameState.initGameState(true, false, true, false);

    const GS_IN_ACTION = 0;

    // TODO
    describe('isGameState()', () => {
        // TODO: check for other general game states
        it('should return true for valid game states', () => {
            assert.ok(GameState.isGameState(GS_START_4_PLAYERS));
            assert.ok(GameState.isGameState(GS_START_2_PLAYERS));
        });

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
    describe('arePlayersAlive()', () => {});

    // TODO
    describe('isGameOver()', () => {});

    describe('initGameState()', () => {
        const GS_ONLY_RED = GameState.initGameState(true, false, false, false);
        const GS_ONLY_GREEN = GameState.initGameState(false, true, false, false);
        const GS_ONLY_YELLOW = GameState.initGameState(false, false, true, false);
        const GS_ONLY_BLUE = GameState.initGameState(false, false, false, true);

        const GS_2_RED_BLUE = GameState.initGameState(true, false, false, true);
        const GS_3_PLAYERS_NO_RED = GameState.initGameState(false, true, true, true);

        it('should have 4 pawns per player', () => {
            assert.strictEqual(GS_ONLY_RED.pawns.length, 4);
            assert.strictEqual(GS_ONLY_RED.pawns[0].player, Color.EColor.RED);

            assert.strictEqual(GS_ONLY_GREEN.pawns.length, 4);
            assert.strictEqual(GS_ONLY_GREEN.pawns[0].player, Color.EColor.GREEN);

            assert.strictEqual(GS_ONLY_YELLOW.pawns.length, 4);
            assert.strictEqual(GS_ONLY_YELLOW.pawns[0].player, Color.EColor.YELLOW);

            assert.strictEqual(GS_ONLY_BLUE.pawns.length, 4);
            assert.strictEqual(GS_ONLY_BLUE.pawns[0].player, Color.EColor.BLUE);

            assert.strictEqual(GS_START_2_PLAYERS.pawns.length, 8);
            assert.strictEqual(GS_2_RED_BLUE.pawns.length, 8);
            assert.strictEqual(GS_3_PLAYERS_NO_RED.pawns.length, 12);
            assert.strictEqual(GS_START_4_PLAYERS.pawns.length, 16);
        });

        it('should have correct limits', () => {
            const START_LIMITS = Limits.getStartingLimits();
            const LIMITS_ONLY_RED = {lower:{row:5,col:0}, upper:{row:7,col:3}};
            const LIMITS_RED_BLUE = {lower:{row:0,col:0}, upper:{row:7,col:3}};

            assert.deepStrictEqual(GS_START_2_PLAYERS.limits, START_LIMITS);
            assert.deepStrictEqual(GS_3_PLAYERS_NO_RED.limits, START_LIMITS);
            assert.deepStrictEqual(GS_START_4_PLAYERS.limits, START_LIMITS);
            
            assert.deepStrictEqual(GS_ONLY_RED.limits, LIMITS_ONLY_RED);
            assert.deepStrictEqual(GS_2_RED_BLUE.limits, LIMITS_RED_BLUE);
        });

        it('should be player red on turn or, if there is non, the one next to player red', () => {
            assert.strictEqual(GS_START_4_PLAYERS.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GS_START_2_PLAYERS.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GS_2_RED_BLUE.whoseTurn, Color.EColor.RED);

            assert.strictEqual(GS_3_PLAYERS_NO_RED.whoseTurn, Color.EColor.BLUE);

            assert.strictEqual(GS_ONLY_RED.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GS_ONLY_GREEN.whoseTurn, Color.EColor.GREEN);
            assert.strictEqual(GS_ONLY_YELLOW.whoseTurn, Color.EColor.YELLOW);
            assert.strictEqual(GS_ONLY_BLUE.whoseTurn, Color.EColor.BLUE);
        });
    });

    // TODO
    describe('isValidMove()', () => {
        // valid - normal

        // beating

        // try beating own pawn

        // out of limits

        // wrong player

        // non existing pawn
    });

    // TODO
    describe('makeMove()', () => {});

    // TODO
    describe('getNextPossibleGameStates()', () => {});
});