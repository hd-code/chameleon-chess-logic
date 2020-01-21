const assert = require('assert');
const GameState = require('../../build/models/GameState.js');

const Color = require('../../build/models/Color.js');
const Limits = require('../../build/models/Limits.js');

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

    const GS_ADV_STATE = {
        limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
        pawns: [
            {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:2, col: 1} },
            {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: {row:6, col: 1} },
            {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: {row:6, col: 3} },
            {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:6, col: 5} },
        ],
        whoseTurn: 0
    };
    const GS_ADV_STATE2 = {
        limits: GS_ADV_STATE.limits,
        pawns: GS_ADV_STATE.pawns,
        whoseTurn: 2
    };

    // TODO
    describe('isGameState()', () => {
        // TODO: check for other general game states
        it('should return true for valid game states', () => {
            assert.ok(GameState.isGameState(GS_START_4_PLAYERS));
            assert.ok(GameState.isGameState(GS_START_2_PLAYERS));
            assert.ok(GameState.isGameState(GS_ADV_STATE));
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
        const CASES = [
            {   actual: GameState.arePlayersAlive(GS_START_4_PLAYERS),
                expected: { 0:true, 1:true, 2:true, 3:true } },
            {   actual: GameState.arePlayersAlive(GS_START_2_PLAYERS),
                expected: { 0:true, 1:false, 2:true, 3:false } },
            {   actual: GameState.arePlayersAlive(GS_ADV_STATE),
                expected: { 0:true, 1:false, 2:true, 3:false } },
            {   actual: GameState.arePlayersAlive(GS_ONLY_RED),
                expected: { 0:true, 1:false, 2:false, 3:false } },
            {   actual: GameState.arePlayersAlive(GS_ONLY_GREEN),
                expected: { 0:false, 1:true, 2:false, 3:false } },
            {   actual: GameState.arePlayersAlive(GS_ONLY_YELLOW),
                expected: { 0:false, 1:false, 2:true, 3:false } },
            {   actual: GameState.arePlayersAlive(GS_ONLY_BLUE),
                expected: { 0:false, 1:false, 2:false, 3:true } },
            {   actual: GameState.arePlayersAlive(GS_2_RED_BLUE),
                expected: { 0:true, 1:false, 2:false, 3:true } },
            {   actual: GameState.arePlayersAlive(GS_3_PLAYERS_NO_RED),
                expected: { 0:false, 1:true, 2:true, 3:true } },
        ];

        CASES.forEach(({actual,expected}) => {
            assert.deepStrictEqual(actual, expected);
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
            assert.ok(!GameState.isGameOver(GS_START_4_PLAYERS));
            assert.ok(!GameState.isGameOver(GS_START_2_PLAYERS));
            assert.ok(!GameState.isGameOver(GS_ADV_STATE));
            assert.ok(!GameState.isGameOver(GS_2_RED_BLUE));
            assert.ok(!GameState.isGameOver(GS_3_PLAYERS_NO_RED));
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

    describe('isValidMove()', () => {
        it('should return true for normal moves without shrinking', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 2, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 2, { row: 4, col: 4 })
            ];
            actual.forEach(actual => assert.ok(actual));
        });

        it('should return true for normal moves with shrinking', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 3, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE2, 3, { row: 6, col: 4 })
            ];
            actual.forEach(actual => assert.ok(actual));
        });

        it('should return true for normal moves with shrinking to smallest field size', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 5, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE2, 3, { row: 6, col: 4 })
            ];
            actual.forEach(actual => assert.ok(actual));
        });
        
        it('should return true for beating an opponents pawn without shrinking the board', () => {
            assert.ok(GameState.isValidMove(GS_ADV_STATE, 1, { row: 6, col: 3 }));
        });

        it('should return true for beating an opponents pawn with shrinking the board', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 6, col: 5 }),
                GameState.isValidMove(GS_ADV_STATE2, 3, { row: 2, col: 1 })
            ];
            actual.forEach(actual => assert.ok(actual));
        });

        it('should return false for trying to move to a position that is not reachable in the current role', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 3, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE, 1, { row: 3, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 2, { row: 3, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 3, { row: 3, col: 3 })
            ];
            actual.forEach(actual => assert.ok(!actual));
        });

        it('should return false for trying to beat ones own pawn', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 6, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE, 1, { row: 2, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE2, 3, { row: 6, col: 3 })
            ];
            actual.forEach(actual => assert.ok(!actual));
        });
        
        it('should return false for trying to move a pawn over/through another own pawn', () => {
            assert.ok(!GameState.isValidMove(GS_ADV_STATE2, 3, { row: 6, col: 2 }));
        });

        it('should return false for trying to move a pawn over/through opponents pawn', () => {
            assert.ok(!GameState.isValidMove(GS_ADV_STATE, 1, { row: 6, col: 4 }));
        });
        
        it('should return false for trying to move pawn out of limits', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 2, col: 0 }),
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 2, col: 7 }),
                GameState.isValidMove(GS_ADV_STATE, 0, { row: 0, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 2, { row: 7, col: 5 }),
                GameState.isValidMove(GS_ADV_STATE2, 2, { row: 7, col: 1 }),
            ];
            actual.forEach(actual => assert.ok(!actual));
        });

        it('should return false for trying to move a pawn of a player who is not on turn', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE2, 0, { row: 2, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE, 2, { row: 4, col: 4 }),
                GameState.isValidMove(GS_ADV_STATE2, 0, { row: 3, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE, 3, { row: 6, col: 4 }),
                GameState.isValidMove(GS_ADV_STATE2, 0, { row: 5, col: 1 }),
                GameState.isValidMove(GS_ADV_STATE, 3, { row: 6, col: 4 }),
                GameState.isValidMove(GS_ADV_STATE2, 1, { row: 6, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 0, { row: 6, col: 5 }),
                GameState.isValidMove(GS_ADV_STATE, 3, { row: 2, col: 1 }),
            ];
            actual.forEach(actual => assert.ok(!actual));
        });

        it('should return false for trying to move a non existing pawn', () => {
            const actual = [
                GameState.isValidMove(GS_ADV_STATE, 4, { row: 4, col: 4 }),
                GameState.isValidMove(GS_ADV_STATE, 5, { row: 4, col: 4 }),
                GameState.isValidMove(GS_ADV_STATE2, 4, { row: 2, col: 3 }),
                GameState.isValidMove(GS_ADV_STATE2, 8, { row: 2, col: 3 }),
            ];
            actual.forEach(actual => assert.ok(!actual));
        });
    });

    // TODO
    describe('makeMove()', () => {});

    // TODO
    describe('getNextPossibleGameStates()', () => {});
});