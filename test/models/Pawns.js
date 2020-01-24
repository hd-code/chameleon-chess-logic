const assert = require('assert');
const Pawns = require('../../build/models/Pawns');

const { isArray } = require('../../lib/hd-helper');

const TestData = require('../test-data');

// -----------------------------------------------------------------------------

describe('models/Pawns', () => {
    const TEST_PAWNS = TestData.testMovesOfRoles.gameState.pawns;
    const PAWN1 = TEST_PAWNS[0];
    const PAWN2 = TEST_PAWNS[1]; // Knight
    const PAWN3 = TEST_PAWNS[2];
    const PAWN4 = TEST_PAWNS[3];

    const START_LIMITS = TestData.testMovesOfRoles.gameState.limits;
    const SMALL_LIMITS = { lower:START_LIMITS.lower, upper:{row:3,col:3} };

    describe('isPawn()', () => {
        it('should return true for valid pawns', () => {
            TEST_PAWNS.forEach(p => assert.ok(Pawns.isPawn(p)));
        });

        it('should return false for non-existing player', () => {
            const PAWN_NO_PLAYER = {position:PAWN1.position, roles:PAWN1.roles};

            const PAWN_INVALID_PLAYER_1 = {player: 5, ...PAWN_NO_PLAYER};
            const PAWN_INVALID_PLAYER_2 = {player:-1, ...PAWN_NO_PLAYER};

            assert.ok(!Pawns.isPawn(PAWN_NO_PLAYER));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_PLAYER_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_PLAYER_2));
        });

        it('should return false for invalid positions', () => {
            const PAWN_NO_POSITION = {player:PAWN1.player, roles:PAWN1.roles};

            const PAWN_INVALID_POSITION_1 = {position:{}, ...PAWN_NO_POSITION};
            const PAWN_INVALID_POSITION_2 = {position:{row:3},  ...PAWN_NO_POSITION};

            assert.ok(!Pawns.isPawn(PAWN_NO_POSITION));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_POSITION_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_POSITION_2));
        });

        it('should return false for invalid roles', () => {
            const PAWN_NO_ROLES = { player: PAWN1.player, position: PAWN1.position };

            const PAWN_INVALID_ROLES_1 = {roles: PAWN1.position, ...PAWN_NO_ROLES};
            const PAWN_INVALID_ROLES_2 = {roles:  PAWN1.player,  ...PAWN_NO_ROLES};

            assert.ok(!Pawns.isPawn(PAWN_NO_ROLES));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_ROLES_1));
            assert.ok(!Pawns.isPawn(PAWN_INVALID_ROLES_2));
        });

        it('should return false invalid role combinations', () => {
            const PAWN_SAME_ROLE = {
                player: PAWN1.player, position: PAWN1.position,
                roles:   {0:0, 1:0, 2:0, 3:0}
            };
            const PAWN_WRONG_ROLE_ORDER = {
                player: PAWN1.player, position: PAWN1.position,
                roles:   {0:0, 1:2, 2:1, 3:3}
            };

            assert.ok(!Pawns.isPawn(PAWN_SAME_ROLE));
            assert.ok(!Pawns.isPawn(PAWN_WRONG_ROLE_ORDER));
        });
        
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

    describe('areAllPawnsWithinLimits()', () => {
        it('should return true if all pawns are within the limits', () => {
            assert.ok(Pawns.areAllPawnsWithinLimits(TEST_PAWNS, START_LIMITS));
        });

        it('should return false if pawns are outside the limits', () => {
            assert.ok(!Pawns.areAllPawnsWithinLimits(TEST_PAWNS, SMALL_LIMITS));
        });

        it('should return true if there are no pawns at all, because there is none outside the limits', () => {
            assert.ok(Pawns.areAllPawnsWithinLimits([], START_LIMITS));
        });
    });

    describe('areTherePawnsOnTheSameField()', () => {
        it('should return true if there is more than one pawn on the same field', () => {
            const SAME_POS_2 = [...TEST_PAWNS, PAWN1];
            const SAME_POS_3 = [...TEST_PAWNS, PAWN1, PAWN1];
            const SAME_POS_2_2 = [...TEST_PAWNS, PAWN1, PAWN2];

            const actual1 = Pawns.areTherePawnsOnTheSameField(SAME_POS_2);
            const actual2 = Pawns.areTherePawnsOnTheSameField(SAME_POS_3);
            const actual3 = Pawns.areTherePawnsOnTheSameField(SAME_POS_2_2);

            assert.ok(actual1);
            assert.ok(actual2);
            assert.ok(actual3);
        });

        it('should return false if no pawns are on the same field', () => {
            assert.ok(!Pawns.areTherePawnsOnTheSameField(TEST_PAWNS));
        });

        it('should return false if there are no pawns at all', () => {
            assert.ok(!Pawns.areTherePawnsOnTheSameField([]));
        });
    });

    describe('getDefaultPawnsForPlayer()', () => {
        const pawnsRed    = Pawns.getDefaultPawnsForPlayer(0);
        const pawnsGreen  = Pawns.getDefaultPawnsForPlayer(1);
        const pawnsYellow = Pawns.getDefaultPawnsForPlayer(2);
        const pawnsBlue   = Pawns.getDefaultPawnsForPlayer(3);

        it('should return 4 pawns for each player', () => {
            assert.strictEqual(pawnsRed.length,   4);
            assert.strictEqual(pawnsGreen.length, 4);
            assert.strictEqual(pawnsYellow.length,4);
            assert.strictEqual(pawnsBlue.length,  4);
        });
        
        it('should return valid pawns', () => {
            assert.ok(isArray(pawnsRed,   Pawns.isPawn));
            assert.ok(isArray(pawnsGreen, Pawns.isPawn));
            assert.ok(isArray(pawnsYellow,Pawns.isPawn));
            assert.ok(isArray(pawnsBlue,  Pawns.isPawn));
        });
    });

    it('getNumOfPawnsPerPlayer()', () => {
        it('should return correct number of pawns per player', () => {
            const actual1 = Pawns.getNumOfPawnsPerPlayer(TestData.testMovesOfRoles.gameState.pawns);
            const expected1 = TestData.testMovesOfRoles.numOfPawnsPerPlayer;

            const actual2 = Pawns.getNumOfPawnsPerPlayer(TestData.testAdvancedMoves.gameState.pawns);
            const expected2 = TestData.testAdvancedMoves.numOfPawnsPerPlayer;

            const actual3 = Pawns.getNumOfPawnsPerPlayer([]);
            const expected3 = {0:0, 1:0, 2:0, 3:0};

            assert.deepStrictEqual(actual1, expected1);
            assert.deepStrictEqual(actual2, expected2);
            assert.deepStrictEqual(actual3, expected3);
        });
    });

    describe('getIndexOfPawn()', () => {
        it('should return the index of the pawn in the array of pawns', () => {
            const actual1 = Pawns.getIndexOfPawn(PAWN1, TEST_PAWNS);
            const actual2 = Pawns.getIndexOfPawn(PAWN2, TEST_PAWNS);
            const actual3 = Pawns.getIndexOfPawn(PAWN3, TEST_PAWNS);

            assert.strictEqual(actual1, 0);
            assert.strictEqual(actual2, 1);
            assert.strictEqual(actual3, 2);
        });

        it('should return -1 for a pawn that is not in the array', () => {
            const testArray = [ PAWN1, PAWN2, PAWN3];
            const actual = Pawns.getIndexOfPawn(PAWN4, testArray);
            assert.strictEqual(actual, -1);
        });

        it('should always return -1 if an empty array is passed', () => {
            const actual = Pawns.getIndexOfPawn(PAWN1, []);
            assert.strictEqual(actual, -1);
        });
    });

    describe('getIndexOfPawnAtPosition()', () => {
        it('should return the index of the pawn that is at the given position', () => {
            const actual1 = Pawns.getIndexOfPawnAtPosition(PAWN1.position, TEST_PAWNS);
            const actual2 = Pawns.getIndexOfPawnAtPosition(PAWN2.position, TEST_PAWNS);
            const actual3 = Pawns.getIndexOfPawnAtPosition(PAWN3.position, TEST_PAWNS);

            assert.strictEqual(actual1, 0);
            assert.strictEqual(actual2, 1);
            assert.strictEqual(actual3, 2);
        });

        it('should return -1 for a position where no pawn is at', () => {
            const testArray = [ PAWN1, PAWN2, PAWN3 ];
            const actual = Pawns.getIndexOfPawnAtPosition(PAWN4.position, testArray);
            assert.strictEqual(actual, -1);
        });

        it('should always return -1 if an empty array is passed', () => {
            const actual = Pawns.getIndexOfPawnAtPosition(PAWN1.position, []);
            assert.strictEqual(actual, -1);
        });
    });

    describe('getIndexOfPawnInDeadlock()', () => {
        it('should return index of pawn, if field is 3x3 and center pawn is knight', () => {
            const LIMITS = {
                lower:{ row: PAWN2.position.row-1, col: PAWN2.position.col-1 },
                upper:{ row: PAWN2.position.row+1, col: PAWN2.position.col+1 },
            }

            const actual = Pawns.getIndexOfPawnInDeadlock(TEST_PAWNS, LIMITS);
            assert.strictEqual(actual, 1);
        });

        it('should return -1 if field is 3x3 but center pawn is not knight', () => {
            const LIMITS = {
                lower:{ row: PAWN1.position.row-1, col: PAWN1.position.col-1 },
                upper:{ row: PAWN1.position.row+1, col: PAWN1.position.col+1 },
            }

            const actual = Pawns.getIndexOfPawnInDeadlock(TEST_PAWNS, LIMITS);
            assert.strictEqual(actual, -1);
        });

        it('should return -1 if the field is bigger than 3x3', () => {
            const actual1 = Pawns.getIndexOfPawnInDeadlock(TEST_PAWNS, START_LIMITS);
            const actual2 = Pawns.getIndexOfPawnInDeadlock(
                TestData.testSpecialCase.gameState.pawns,
                TestData.testSpecialCase.gameState.limits
            );

            assert.strictEqual(actual1, -1);
            assert.strictEqual(actual2, -1);
        });
    });

    describe('getNextMoves()', () => {
        const TestCase = TestData.testMovesOfRoles;

        describe('should return correct moves for knight', () => {
            const moves = Pawns.getNextMoves(TestCase.pawnIKnight, TestCase.gameState.pawns, TestCase.gameState.limits);
            assert.ok(TestData.isSameMoves(moves, TestCase.validKnightMoves));
        });

        describe('should return correct moves for bishop', () => {
            const moves = Pawns.getNextMoves(TestCase.pawnIBishop, TestCase.gameState.pawns, TestCase.gameState.limits);
            assert.ok(TestData.isSameMoves(moves, TestCase.validBishopMoves));
        });

        describe('should return correct moves for rook', () => {
            const moves = Pawns.getNextMoves(TestCase.pawnIRook, TestCase.gameState.pawns, TestCase.gameState.limits);
            assert.ok(TestData.isSameMoves(moves, TestCase.validRookMoves));
        });

        describe('should return correct moves for queen', () => {
            const moves = Pawns.getNextMoves(TestCase.pawnIQueen, TestCase.gameState.pawns, TestCase.gameState.limits);
            assert.ok(TestData.isSameMoves(moves, TestCase.validQueenMoves));
        });
    });
});