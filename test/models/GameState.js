const assert = require('assert');
const GameState = require('../../build/models/GameState');

const Color = require('../../build/models/Color');
const Limits = require('../../build/models/Limits');

const TestData = require('../test-data');

// -----------------------------------------------------------------------------

describe('models/GameState', () => {
    const GS_START_4_PLAYERS = GameState.createGameState(true, true, true, true);
    const GS_START_2_PLAYERS = GameState.createGameState(true, false, true, false);

    const GS_ONLY_RED = GameState.createGameState(true, false, false, false);
    const GS_ONLY_GREEN = GameState.createGameState(false, true, false, false);
    const GS_ONLY_YELLOW = GameState.createGameState(false, false, true, false);
    const GS_ONLY_BLUE = GameState.createGameState(false, false, false, true);

    const GS_2_RED_BLUE = GameState.createGameState(true, false, false, true);
    const GS_3_PLAYERS_NO_RED = GameState.createGameState(false, true, true, true);

    // One could make more test here, but tests are already done in main.js.
    describe('isGameState()', () => {
        it('should return true for valid game states', () => {
            assert.ok(GameState.isGameState(TestData.testAdvancedMoves.gameState));
            assert.ok(GameState.isGameState(TestData.testMovesOfRoles.gameState));
            assert.ok(GameState.isGameState(TestData.testShrinkingOfBoard.gameState));
            assert.ok(GameState.isGameState(TestData.testSpecialCase.gameState));
            assert.ok(GameState.isGameState(TestData.testSpecialCaseWinning.gameState));
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

    it('arePlayersAlive()', () => {
        const Cases = [
            {   gs: TestData.testAdvancedMoves.gameState, 
                expected: TestData.testAdvancedMoves.arePlayersAlive },
            {   gs: TestData.testMovesOfRoles.gameState, 
                expected: TestData.testMovesOfRoles.arePlayersAlive },
            {   gs: TestData.testShrinkingOfBoard.gameState, 
                expected: TestData.testShrinkingOfBoard.arePlayersAlive },
            {   gs: TestData.testSpecialCase.gameState, 
                expected: TestData.testSpecialCase.arePlayersAlive },
            {   gs: TestData.testSpecialCaseWinning.gameState, 
                expected: TestData.testSpecialCaseWinning.arePlayersAlive },
        ];

        Cases.forEach(({gs,expected}) => {
            assert.deepStrictEqual(GameState.arePlayersAlive(gs), expected);
        });
    });

    describe('isGameOver()', () => {
        it('should return true if there are only pawns of one player left', () => {
            assert.ok(GameState.isGameOver(GS_ONLY_RED));
            assert.ok(GameState.isGameOver(GS_ONLY_GREEN));
            assert.ok(GameState.isGameOver(GS_ONLY_YELLOW));
            assert.ok(GameState.isGameOver(GS_ONLY_BLUE));
        });

        it('should return false if there pawns of more than one player left', () => {
            assert.ok(!GameState.isGameOver(TestData.testAdvancedMoves.gameState));
            assert.ok(!GameState.isGameOver(TestData.testMovesOfRoles.gameState));
            assert.ok(!GameState.isGameOver(TestData.testShrinkingOfBoard.gameState));
            assert.ok(!GameState.isGameOver(TestData.testSpecialCase.gameState));
            assert.ok(!GameState.isGameOver(TestData.testSpecialCaseWinning.gameState));
        });
    });

    describe('createGameState()', () => {
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

        it('should be player red on turn or, if there is none, the one next to player red', () => {
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

    it('getNextPossibleGameStates()', () => {
        const GSs = GameState.getNextPossibleGameStates(TestData.testMovesOfRoles.gameState);

        const numOfMoves = 0
            + TestData.testMovesOfRoles.validBishopMoves.length
            + TestData.testMovesOfRoles.validKnightMoves.length
            + TestData.testMovesOfRoles.validRookMoves.length
            + TestData.testMovesOfRoles.validQueenMoves.length;

        assert.strictEqual(GSs.length, numOfMoves);
    });
});