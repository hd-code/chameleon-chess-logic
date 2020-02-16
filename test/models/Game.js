const assert = require('assert');
const Game = require('../../build/models/Game');

const Color = require('../../build/models/Color');
const Limits = require('../../build/models/Limits');

const TestData = require('../test-data');

// -----------------------------------------------------------------------------

describe('models/Game', () => {
    const GAME_START_4_PLAYERS = Game.createGame(true, true, true, true);
    const GAME_START_2_PLAYERS = Game.createGame(true, false, true, false);

    const GAME_ONLY_RED = Game.createGame(true, false, false, false);
    const GAME_ONLY_GREEN = Game.createGame(false, true, false, false);
    const GAME_ONLY_YELLOW = Game.createGame(false, false, true, false);
    const GAME_ONLY_BLUE = Game.createGame(false, false, false, true);

    const GAME_2_RED_BLUE = Game.createGame(true, false, false, true);
    const GAME_3_PLAYERS_NO_RED = Game.createGame(false, true, true, true);

    // One could make more test here, but tests are already done in main.js.
    describe('isGame()', () => {
        it('should return true for valid game states', () => {
            assert.ok(Game.isGame(TestData.testAdvancedMoves.game));
            assert.ok(Game.isGame(TestData.testMovesOfRoles.game));
            assert.ok(Game.isGame(TestData.testShrinkingOfBoard.game));
            assert.ok(Game.isGame(TestData.testSpecialCase.game));
            assert.ok(Game.isGame(TestData.testSpecialCaseWinning.game));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!Game.isGame(DIFF_OBJ));
            assert.ok(!Game.isGame(DIFF_ARR));
            assert.ok(!Game.isGame(' '));
            assert.ok(!Game.isGame(true));
            assert.ok(!Game.isGame(null));
            assert.ok(!Game.isGame());
        });
    });

    it('arePlayersAlive()', () => {
        const Cases = [
            {   game: TestData.testAdvancedMoves.game, 
                expected: TestData.testAdvancedMoves.arePlayersAlive },
            {   game: TestData.testMovesOfRoles.game, 
                expected: TestData.testMovesOfRoles.arePlayersAlive },
            {   game: TestData.testShrinkingOfBoard.game, 
                expected: TestData.testShrinkingOfBoard.arePlayersAlive },
            {   game: TestData.testSpecialCase.game, 
                expected: TestData.testSpecialCase.arePlayersAlive },
            {   game: TestData.testSpecialCaseWinning.game, 
                expected: TestData.testSpecialCaseWinning.arePlayersAlive },
        ];

        Cases.forEach(({game,expected}) => {
            assert.deepStrictEqual(Game.arePlayersAlive(game), expected);
        });
    });

    describe('isGameOver()', () => {
        it('should return true if there are only pawns of one player left', () => {
            assert.ok(Game.isGameOver(GAME_ONLY_RED));
            assert.ok(Game.isGameOver(GAME_ONLY_GREEN));
            assert.ok(Game.isGameOver(GAME_ONLY_YELLOW));
            assert.ok(Game.isGameOver(GAME_ONLY_BLUE));
        });

        it('should return false if there pawns of more than one player left', () => {
            assert.ok(!Game.isGameOver(TestData.testAdvancedMoves.game));
            assert.ok(!Game.isGameOver(TestData.testMovesOfRoles.game));
            assert.ok(!Game.isGameOver(TestData.testShrinkingOfBoard.game));
            assert.ok(!Game.isGameOver(TestData.testSpecialCase.game));
            assert.ok(!Game.isGameOver(TestData.testSpecialCaseWinning.game));
        });
    });

    describe('createGame()', () => {
        it('should have 4 pawns per player', () => {
            assert.strictEqual(GAME_ONLY_RED.pawns.length, 4);
            assert.strictEqual(GAME_ONLY_RED.pawns[0].player, Color.EColor.RED);

            assert.strictEqual(GAME_ONLY_GREEN.pawns.length, 4);
            assert.strictEqual(GAME_ONLY_GREEN.pawns[0].player, Color.EColor.GREEN);

            assert.strictEqual(GAME_ONLY_YELLOW.pawns.length, 4);
            assert.strictEqual(GAME_ONLY_YELLOW.pawns[0].player, Color.EColor.YELLOW);

            assert.strictEqual(GAME_ONLY_BLUE.pawns.length, 4);
            assert.strictEqual(GAME_ONLY_BLUE.pawns[0].player, Color.EColor.BLUE);

            assert.strictEqual(GAME_START_2_PLAYERS.pawns.length, 8);
            assert.strictEqual(GAME_2_RED_BLUE.pawns.length, 8);
            assert.strictEqual(GAME_3_PLAYERS_NO_RED.pawns.length, 12);
            assert.strictEqual(GAME_START_4_PLAYERS.pawns.length, 16);
        });

        it('should have correct limits', () => {
            const START_LIMITS = Limits.getStartingLimits();
            const LIMITS_ONLY_RED = {lower:{row:5,col:0}, upper:{row:7,col:3}};
            const LIMITS_RED_BLUE = {lower:{row:0,col:0}, upper:{row:7,col:3}};

            assert.deepStrictEqual(GAME_START_2_PLAYERS.limits, START_LIMITS);
            assert.deepStrictEqual(GAME_3_PLAYERS_NO_RED.limits, START_LIMITS);
            assert.deepStrictEqual(GAME_START_4_PLAYERS.limits, START_LIMITS);
            
            assert.deepStrictEqual(GAME_ONLY_RED.limits, LIMITS_ONLY_RED);
            assert.deepStrictEqual(GAME_2_RED_BLUE.limits, LIMITS_RED_BLUE);
        });

        it('should be player red on turn or, if there is none, the one next to player red', () => {
            assert.strictEqual(GAME_START_4_PLAYERS.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GAME_START_2_PLAYERS.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GAME_2_RED_BLUE.whoseTurn, Color.EColor.RED);

            assert.strictEqual(GAME_3_PLAYERS_NO_RED.whoseTurn, Color.EColor.BLUE);

            assert.strictEqual(GAME_ONLY_RED.whoseTurn, Color.EColor.RED);
            assert.strictEqual(GAME_ONLY_GREEN.whoseTurn, Color.EColor.GREEN);
            assert.strictEqual(GAME_ONLY_YELLOW.whoseTurn, Color.EColor.YELLOW);
            assert.strictEqual(GAME_ONLY_BLUE.whoseTurn, Color.EColor.BLUE);
        });
    });

    it('getNextPossibleGames()', () => {
        const Games = Game.getNextPossibleGames(TestData.testMovesOfRoles.game);

        const numOfMoves = 0
            + TestData.testMovesOfRoles.validBishopMoves.length
            + TestData.testMovesOfRoles.validKnightMoves.length
            + TestData.testMovesOfRoles.validRookMoves.length
            + TestData.testMovesOfRoles.validQueenMoves.length;

        assert.strictEqual(Games.length, numOfMoves);
    });
});