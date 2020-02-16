const assert = require('assert');
const ccl = require('../build/main');

const { deepClone, isArray } = require('../lib/hd-helper');

const TestData = require('./test-data');

// -----------------------------------------------------------------------------

describe('main', () => {
    describe('getBoard()', () => {
        it('should return an 8x8 array of colors (0,1,2,3)', () => {
            const numOfRowsCols = 8;
            const board = ccl.getBoard();

            assert.ok(isArray(board));
            assert.strictEqual(board.length, numOfRowsCols);

            for (let i = 0; i < numOfRowsCols; i++) {
                assert.ok(isArray(board[i], isColor));
                assert.strictEqual(board[i].length, numOfRowsCols);
            }

            function isColor(color) {
                return [0,1,2,3].indexOf(color) !== -1;
            }
        });
    });

    describe('initGame()', () => {
        it('should return a valid game object for two or more players', () => {
            const actual = [
                ccl.initGame(true, true, true, true),
                
                ccl.initGame(true, true, true, false),
                ccl.initGame(true, true, false, false),
                ccl.initGame(true, false, true, false),
                ccl.initGame(false, true, true, false),
                
                ccl.initGame(true, true, false, true),
                ccl.initGame(true, false, false, true),
                ccl.initGame(false, true, false, true),

                ccl.initGame(true, false, true, true),
                ccl.initGame(false, false, true, true),
            ];
            actual.forEach(gs => assert.ok(ccl.isValidGame(gs)));
        });

        it('should return null if less than two players were requested', () => {
            const actual = [
                ccl.initGame(false, false, false, false),
                ccl.initGame(false, false, false, true),
                ccl.initGame(false, false, true, false),
                ccl.initGame(false, true, false, false),
                ccl.initGame(true, false, false, false),
            ];
            actual.forEach(gs => assert.strictEqual(gs, null));
        });
    });

    describe('getIndexOfPawnAtPosition()', () => {
        it('should return correct index', () => {
            test(TestData.testAdvancedMoves.game);
            test(TestData.testMovesOfRoles.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testSpecialCaseWinning.game);

            function test(gs) {
                gs.pawns.forEach((_,i) => {
                    const actual = ccl.getIndexOfPawnAtPosition(gs, gs.pawns[i].position);
                    assert.strictEqual(actual, i);
                });
            }
        });

        it('should return -1 if there is no pawn at position', () => {
            test(TestData.testAdvancedMoves.game);
            test(TestData.testMovesOfRoles.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testSpecialCaseWinning.game);

            function test(gs) {
                let pos1 = deepClone(gs.limits);
                pos1.lower.row -= 1;

                let pos2 = deepClone(gs.limits);
                pos2.upper.row += 1;

                let pos3 = deepClone(gs.limits);
                pos3.upper.col += 1;

                assert.strictEqual(ccl.getIndexOfPawnAtPosition(gs, pos1), -1);
                assert.strictEqual(ccl.getIndexOfPawnAtPosition(gs, pos2), -1);
                assert.strictEqual(ccl.getIndexOfPawnAtPosition(gs, pos3), -1);
            }
        });
    });

    describe('getMoves()', () => {
        const TestCase = TestData.testMovesOfRoles;

        it('should return all valid knight moves', () => {
            const actual = ccl.getMoves(TestCase.game, TestCase.pawnIKnight);
            assert.ok(TestData.isSameMoves(actual, TestCase.validKnightMoves));
        });

        it('should return all valid bishop moves', () => {
            const actual = ccl.getMoves(TestCase.game, TestCase.pawnIBishop);
            assert.ok(TestData.isSameMoves(actual, TestCase.validBishopMoves));
        });

        it('should return all valid rook moves', () => {
            const actual = ccl.getMoves(TestCase.game, TestCase.pawnIRook);
            assert.ok(TestData.isSameMoves(actual, TestCase.validRookMoves));
        });

        it('should return all valid queen moves', () => {
            const actual = ccl.getMoves(TestCase.game, TestCase.pawnIQueen);
            assert.ok(TestData.isSameMoves(actual, TestCase.validQueenMoves));
        });

        it('should return an empty array if there is no pawn at that index', () => {
            test(TestData.testAdvancedMoves.game);
            test(TestData.testMovesOfRoles.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testSpecialCaseWinning.game);

            function test(gs) {
                const actual1 = ccl.getMoves(gs, -1);
                const actual2 = ccl.getMoves(gs, 13);
                const actual3 = ccl.getMoves(gs, 2.5);

                assert.ok(isArray(actual1));
                assert.ok(isArray(actual2));
                assert.ok(isArray(actual3));

                assert.strictEqual(actual1.length, 0);
                assert.strictEqual(actual2.length, 0);
                assert.strictEqual(actual3.length, 0);
            }
        });
    });

    describe('makeMove()', () => {
        it('should make moves', () => {
            const gs1 = TestData.testShrinkingOfBoard.game;
            const cases1 = TestData.testShrinkingOfBoard;

            test(gs1, cases1.noShrinking);
            test(gs1, cases1.shrinkColsRight);
            test(gs1, cases1.shrinkColsRightToSmallest);
            test(gs1, cases1.shrinkRowsAndColsTopRight);
            test(gs1, cases1.shrinkRowsAndColsTopRightToSmallest);
            test(gs1, cases1.shrinkRowsTop);
            test(gs1, cases1.shrinkRowsTopToSmallest);
            test(gs1, cases1.shrinkingBeatingWinning);
            test(gs1, cases1.shrinkingOtherPawnsSetLimits);

            const gs2 = TestData.testAdvancedMoves.game;
            const cases2 = TestData.testAdvancedMoves;

            test(gs2, cases2.beating);
            test(gs2, cases2.beatingAndShrinking);
            test(gs2, cases2.normalMove);
            test(gs2, cases2.shrinking);
            test(gs2, cases2.shrinkingToSmallestRow);

            function test(gs, Case) {
                const move = Case.move;
                const expectedGS = Case.game;
                assert.deepStrictEqual(ccl.makeMove(gs, move.pawnI, move.destination), expectedGS);
            }
        });

        it('should remove center pawn if smallest field and knight', () => {
            const gs = TestData.testSpecialCase.game

            const case1 = TestData.testSpecialCase.beatingAndBeingRemoved
            const move1 = case1.move
            const expected1 = case1.game

            const case2 = TestData.testSpecialCase.creatingSmallestBoardRemoveTrappedPawn
            const move2 = case2.move
            const expected2 = case2.game
            
            assert.deepStrictEqual(ccl.makeMove(gs, move1.pawnI, move1.destination), expected1);
            assert.deepStrictEqual(ccl.makeMove(gs, move2.pawnI, move2.destination), expected2);
        });

        it('should not remove center pawn if it is the winning move', () => {
            const gs = TestData.testSpecialCaseWinning.game;

            const Case = TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning;
            const move = Case.move;
            const expected = Case.game;
            
            assert.deepStrictEqual(ccl.makeMove(gs, move.pawnI, move.destination), expected);
        });

        it('should return null for invalid moves', () => {
            const gs1 = TestData.testMovesOfRoles.game;
            TestData.testMovesOfRoles.invalidMovesForAll.forEach(destination => {
                assert.strictEqual(ccl.makeMove(gs1, 0, destination), null);
                assert.strictEqual(ccl.makeMove(gs1, 1, destination), null);
                assert.strictEqual(ccl.makeMove(gs1, 2, destination), null);
                assert.strictEqual(ccl.makeMove(gs1, 3, destination), null);
            });

            const gs2 = TestData.testAdvancedMoves.game;
            TestData.testAdvancedMoves.invalidMoves.forEach(move => {
                assert.strictEqual(ccl.makeMove(gs2, move.pawnI, move.destination), null);
            });
        });
    });

    describe('letComputerMakeMove()', () => {});

    it('arePlayersAlive()', () => {
        test(TestData.testAdvancedMoves);
        test(TestData.testMovesOfRoles);
        test(TestData.testShrinkingOfBoard);
        test(TestData.testSpecialCase);
        test(TestData.testSpecialCaseWinning);

        function test(Case) {
            assert.deepStrictEqual(ccl.arePlayersAlive(Case.game), Case.arePlayersAlive);
        }
    });

    describe('isGameOver()', () => {
        it('should return true if there is a winner', () => {
            const gss = [
                TestData.testShrinkingOfBoard.shrinkingBeatingWinning.game,
                TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning.game
            ];
            gss.forEach(gs => assert.ok(ccl.isGameOver(gs)));
        });

        it('should return false for game objects with more than one players', () => {
            assert.ok(!ccl.isGameOver(TestData.testAdvancedMoves.game));
            assert.ok(!ccl.isGameOver(TestData.testMovesOfRoles.game));
            assert.ok(!ccl.isGameOver(TestData.testShrinkingOfBoard.game));
            assert.ok(!ccl.isGameOver(TestData.testSpecialCase.game));
            assert.ok(!ccl.isGameOver(TestData.testSpecialCaseWinning.game));
        });
    });

    describe('isValidGame()', () => {
        it('should return true for all valid game objects', () => {
            assert.ok(ccl.isValidGame(TestData.testAdvancedMoves.game));
            assert.ok(ccl.isValidGame(TestData.testMovesOfRoles.game));
            assert.ok(ccl.isValidGame(TestData.testShrinkingOfBoard.game));
            assert.ok(ccl.isValidGame(TestData.testSpecialCase.game));
            assert.ok(ccl.isValidGame(TestData.testSpecialCaseWinning.game));
        });

        it('should return true for a valid game object, even when game is over', () => {
            const gss = [
                TestData.testShrinkingOfBoard.shrinkingBeatingWinning.game,
                TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning.game
            ];
            gss.forEach(gs => assert.ok(ccl.isValidGame(gs)));
        });

        const GS = TestData.testAdvancedMoves.game;

        it('should return false for wrong types in keys', () => {
            const wrongLimits = {limits: GS.whoseTurn, pawns: GS.pawns, whoseTurn: GS.whoseTurn};
            const wrongPawns = {limits: GS.limits, pawns: GS.limits, whoseTurn: GS.whoseTurn};
            const wrongTurn = {limits: GS.limits, pawns: GS.pawns, whoseTurn: '2'};

            assert.ok(!ccl.isValidGame(wrongLimits));
            assert.ok(!ccl.isValidGame(wrongPawns));
            assert.ok(!ccl.isValidGame(wrongTurn));
        });

        it('should return false for missing keys', () => {
            const noLimits = {pawns: GS.pawns, whoseTurn: GS.whoseTurn};
            const noPawns = {limit: GS.limits, whoseTurn: GS.whoseTurn};
            const noTurn = {limit: GS.limits, pawns: GS.pawns};

            assert.ok(!ccl.isValidGame(noLimits));
            assert.ok(!ccl.isValidGame(noPawns));
            assert.ok(!ccl.isValidGame(noTurn));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert.ok(!ccl.isValidGame(DIFF_OBJ));
            assert.ok(!ccl.isValidGame(DIFF_ARR));
            assert.ok(!ccl.isValidGame(' '));
            assert.ok(!ccl.isValidGame(true));
            assert.ok(!ccl.isValidGame(null));
            assert.ok(!ccl.isValidGame());
        });
    });
});