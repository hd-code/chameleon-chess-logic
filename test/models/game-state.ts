import assert from 'assert';
import * as GS from '../../src/models/game-state';

import { getStartLimits, calcLimits } from '../../src/models/limits';
import { EPlayer } from '../../src/models/player';

import { dec2binArray } from '../../lib/aux';

import * as TestData from '../test-data';

// -----------------------------------------------------------------------------

describe('models/game-state', () => {
    describe('isGameState()', () => {
        it('should return true for all kinds of starting game states (except no players)', () => {
            for (let i = 1, ie = 16; i < ie; i++) {
                const configTmp = dec2binArray(i, 4);
                const config = configTmp.map(x => x === 1);
                const gs = GS.beginGame(config[0], config[1], config[2], config[3]);
                assert(GS.isGameState(gs));
            }
        });

        it('should return false, when there are no pawns', () => {
            const gs = GS.beginGame(false, false, false, false);
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there are two pawns on the same field', () => {
            let gs = GS.beginGame(true, true, true, true);
            gs.pawns[0].position = gs.pawns[1].position;
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the global limits (9,9)', () => {
            let gs = GS.beginGame(true, true, true, true);
            gs.pawns[0].position = { row: 9, col: 9 };
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the limits of a shrunken field', () => {
            let gs = GS.beginGame(true, true, false, false);
            gs.pawns[0].position = { row: 0, col: 0 };
            assert(!GS.isGameState(gs));
        });

        it('should return false, when the player on turn is no longer alive', () => {
            let gs = GS.beginGame(true, true, false, false);
            gs.player = EPlayer.BLUE;
            assert(!GS.isGameState(gs));
        });
        
        it('should return false for incomplete game states', () => {
            const DATA = [
                { limits: {}, pawns:[], player: 0 },
                { limits: {}, pawns:[] },
                { limits: {},           player: 0 },
                {             pawns:[], player: 0 },
            ];
            DATA.forEach(limits => assert(!GS.isGameState(limits)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DATA = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            DATA.forEach(data => assert(!GS.isGameState(data)));
        });
    });

    describe('beginGame()', () => {
        it('should return a game state with 16 pawns, start limits and red on turn for a 4 player game', () => {
            const gs = GS.beginGame(true, true, true, true);
            assert.strictEqual(gs.pawns.length, 16);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 12 pawns, start limits and red on turn for a 3 player game (without blue)', () => {
            const gs = GS.beginGame(true, true, true, false);
            assert.strictEqual(gs.pawns.length, 12);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 12 pawns, start limits and blue on turn for a 3 player game (without red)', () => {
            const gs = GS.beginGame(false, true, true, true);
            assert.strictEqual(gs.pawns.length, 12);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.BLUE);
        });

        it('should return a game state with 8 pawns, start limits and red on turn for a 2 player game (red, yellow)', () => {
            const gs = GS.beginGame(true, false, true, false);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 8 pawns, shrunken limits and red on turn for a 2 player game (red, blue)', () => {
            const gs = GS.beginGame(true, false, false, true);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 8 pawns, start limits and blue on turn for a 2 player game (green, blue)', () => {
            const gs = GS.beginGame(false, true, false, true);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.BLUE);
        });

        it('should return a game state with 8 pawns, shrunken limits and yellow on turn for a 2 player game (yellow, green)', () => {
            const gs = GS.beginGame(false, true, true, false);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.YELLOW);
        });

        it('should return a shrunken game state, with red on turn, when only red is requested', () => {
            const gs = GS.beginGame(true, false, false, false);
            assert.strictEqual(gs.pawns.length, 4);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a shrunken game state, with green on turn, when only green is requested', () => {
            const gs = GS.beginGame(false, true, false, false);
            assert.strictEqual(gs.pawns.length, 4);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.GREEN);
        });

        it('should return a game state with no pawns, start limits and red on turn for no players', () => {
            const gs = GS.beginGame(false, false, false, false);
            assert.strictEqual(gs.pawns.length, 0);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });
    });

    describe('getIndexOfPawnAtPosition()', () => {});

    describe('getMoves()', () => {});

    describe('makeMove()', () => {});

    describe('isGameOver()', () => {
        it('should return false for a new 4 player game', () => {
            const gs = GS.beginGame(true, true, true, true);
            assert(!GS.isGameOver(gs));
        });

        it('should return false for a new 3 player game', () => {
            const gs = GS.beginGame(true, true, true, false);
            assert(!GS.isGameOver(gs));
        });

        it('should return false for a new 2 player game', () => {
            const gs = GS.beginGame(true, false, true, false);
            assert(!GS.isGameOver(gs));
        });

        it('should return true for a new 1 player game (red)', () => {
            const gs = GS.beginGame(true, false, false, false);
            assert(GS.isGameOver(gs));
        });

        it('should return true for a new 1 player game (green)', () => {
            const gs = GS.beginGame(false, true, false, false);
            assert(GS.isGameOver(gs));
        });

        it('should return true for a new game without players', () => {
            const gs = GS.beginGame(false, true, false, false);
            assert(GS.isGameOver(gs));
        });
    });

    it('getNextGameStates()', () => {
        const Games = GS.getNextGameStates(TestData.testMovesOfRoles.game);

        const numOfMoves = 0
            + TestData.testMovesOfRoles.validBishopMoves.length
            + TestData.testMovesOfRoles.validKnightMoves.length
            + TestData.testMovesOfRoles.validRookMoves.length
            + TestData.testMovesOfRoles.validQueenMoves.length;

        assert.strictEqual(Games.length, numOfMoves);
    });
});

/*

import * as Color from '../../src/models/color';
import * as TestData from '../test-data';

import { deepClone } from '../../lib/aux';
import { isArray } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

describe('models/game-state', () => {
    describe('isGameState()', () => {
        it('should return true for all valid game objects', () => {
            assert(GS.isGameState(TestData.testAdvancedMoves.game));
            assert(GS.isGameState(TestData.testMovesOfRoles.game));
            assert(GS.isGameState(TestData.testShrinkingOfBoard.game));
            assert(GS.isGameState(TestData.testSpecialCase.game));
            assert(GS.isGameState(TestData.testSpecialCaseWinning.game));
        });

        it('should return true for a valid game object, even when game is over', () => {
            const gss = [
                TestData.testShrinkingOfBoard.shrinkingBeatingWinning.game,
                TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning.game
            ];
            gss.forEach(gs => assert(GS.isGameState(gs)));
        });

        const advMovesGS = TestData.testAdvancedMoves.game;

        it('should return false for wrong types in keys', () => {
            const wrongLimits = {limits: advMovesGS.whoseTurn, pawns: advMovesGS.pawns, whoseTurn: advMovesGS.whoseTurn};
            const wrongPawns = {limits: advMovesGS.limits, pawns: advMovesGS.limits, whoseTurn: advMovesGS.whoseTurn};
            const wrongTurn = {limits: advMovesGS.limits, pawns: advMovesGS.pawns, whoseTurn: '2'};

            assert(!GS.isGameState(wrongLimits));
            assert(!GS.isGameState(wrongPawns));
            assert(!GS.isGameState(wrongTurn));
        });

        it('should return false for missing keys', () => {
            const noLimits = {pawns: advMovesGS.pawns, whoseTurn: advMovesGS.whoseTurn};
            const noPawns = {limit: advMovesGS.limits, whoseTurn: advMovesGS.whoseTurn};
            const noTurn = {limit: advMovesGS.limits, pawns: advMovesGS.pawns};

            assert(!GS.isGameState(noLimits));
            assert(!GS.isGameState(noPawns));
            assert(!GS.isGameState(noTurn));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const DIFF_OBJ = {street: 'Baker Street', houseNo: 2};
            const DIFF_ARR = [1,2,3,4];

            assert(!GS.isGameState(DIFF_OBJ));
            assert(!GS.isGameState(DIFF_ARR));
            assert(!GS.isGameState(' '));
            assert(!GS.isGameState(true));
            assert(!GS.isGameState(null));
            assert(!GS.isGameState(undefined));
        });
    });

    describe('beginGame()', () => {
        it('should return a valid game object for two or more players', () => {
            const actual = [
                GS.beginGame(true, true, true, true),
                
                GS.beginGame(true, true, true, false),
                GS.beginGame(true, true, false, false),
                GS.beginGame(true, false, true, false),
                GS.beginGame(false, true, true, false),
                
                GS.beginGame(true, true, false, true),
                GS.beginGame(true, false, false, true),
                GS.beginGame(false, true, false, true),

                GS.beginGame(true, false, true, true),
                GS.beginGame(false, false, true, true),
            ];
            actual.forEach(gs => assert(GS.isGameState(gs)));
        });

        it('should return null if less than two players were requested', () => {
            const actual = [
                GS.beginGame(false, false, false, false),
                GS.beginGame(false, false, false, true),
                GS.beginGame(false, false, true, false),
                GS.beginGame(false, true, false, false),
                GS.beginGame(true, false, false, false),
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

            function test(gs: GS.IGameState) {
                gs.pawns.forEach((_,i) => {
                    const actual = GS.getIndexOfPawnAtPosition(gs, gs.pawns[i].position);
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

            function test(gs: GS.IGameState) {
                let pos1 = deepClone(gs.limits.lower);
                pos1.row -= 1;

                let pos2 = deepClone(gs.limits.upper);
                pos2.row += 1;

                let pos3 = deepClone(gs.limits.upper);
                pos3.col += 1;

                assert.strictEqual(GS.getIndexOfPawnAtPosition(gs, pos1), -1);
                assert.strictEqual(GS.getIndexOfPawnAtPosition(gs, pos2), -1);
                assert.strictEqual(GS.getIndexOfPawnAtPosition(gs, pos3), -1);
            }
        });
    });

    describe('getMoves()', () => {
        const TestCase = TestData.testMovesOfRoles;

        it('should return all valid knight moves', () => {
            const actual = GS.getMoves(TestCase.game, TestCase.pawnIKnight);
            assert(TestData.isSameMoves(actual, TestCase.validKnightMoves));
        });

        it('should return all valid bishop moves', () => {
            const actual = GS.getMoves(TestCase.game, TestCase.pawnIBishop);
            assert(TestData.isSameMoves(actual, TestCase.validBishopMoves));
        });

        it('should return all valid rook moves', () => {
            const actual = GS.getMoves(TestCase.game, TestCase.pawnIRook);
            assert(TestData.isSameMoves(actual, TestCase.validRookMoves));
        });

        it('should return all valid queen moves', () => {
            const actual = GS.getMoves(TestCase.game, TestCase.pawnIQueen);
            assert(TestData.isSameMoves(actual, TestCase.validQueenMoves));
        });

        it('should return an empty array if there is no pawn at that index', () => {
            test(TestData.testAdvancedMoves.game);
            test(TestData.testMovesOfRoles.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testShrinkingOfBoard.game);
            test(TestData.testSpecialCaseWinning.game);

            function test(gs: GS.IGameState) {
                const actual1 = GS.getMoves(gs, -1);
                const actual2 = GS.getMoves(gs, 13);
                const actual3 = GS.getMoves(gs, 2.5);

                assert(isArray(actual1));
                assert(isArray(actual2));
                assert(isArray(actual3));

                assert.deepStrictEqual(actual1, []);
                assert.deepStrictEqual(actual2, []);
                assert.deepStrictEqual(actual3, []);
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

            function test(gs: GS.IGameState, Case: any) {
                const move = Case.move;
                const expectedGS = Case.game;
                assert.deepStrictEqual(GS.makeMove(gs, move.pawnI, move.destination), expectedGS);
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
            
            assert.deepStrictEqual(GS.makeMove(gs, move1.pawnI, move1.destination), expected1);
            assert.deepStrictEqual(GS.makeMove(gs, move2.pawnI, move2.destination), expected2);
        });

        it('should not remove center pawn if it is the winning move', () => {
            const gs = TestData.testSpecialCaseWinning.game;

            const Case = TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning;
            const move = Case.move;
            const expected = Case.game;
            
            assert.deepStrictEqual(GS.makeMove(gs, move.pawnI, move.destination), expected);
        });

        it('should return null for invalid moves', () => {
            const gs1 = TestData.testMovesOfRoles.game;
            TestData.testMovesOfRoles.invalidMovesForAll.forEach(destination => {
                assert.strictEqual(GS.makeMove(gs1, 0, destination), null);
                assert.strictEqual(GS.makeMove(gs1, 1, destination), null);
                assert.strictEqual(GS.makeMove(gs1, 2, destination), null);
                assert.strictEqual(GS.makeMove(gs1, 3, destination), null);
            });

            const gs2 = TestData.testAdvancedMoves.game;
            TestData.testAdvancedMoves.invalidMoves.forEach(move => {
                assert.strictEqual(GS.makeMove(gs2, move.pawnI, move.destination), null);
            });
        });
    });

    it('getPlayersState()', () => {
        test(TestData.testAdvancedMoves);
        test(TestData.testMovesOfRoles);
        test(TestData.testShrinkingOfBoard);
        test(TestData.testSpecialCase);
        test(TestData.testSpecialCaseWinning);

        function test(Case: {game: GS.IGameState, playersState: {[player in Color.EColor]: boolean}}) {
            assert.deepStrictEqual(GS.getPlayersState(Case.game), Case.playersState);
        }
    });

    describe('getWinner()', () => {
        it('should return the correct winner', () => {
            assert.strictEqual(GS.getWinner(TestData.testWinningStates.playerRed), Color.EColor.RED);
            assert.strictEqual(GS.getWinner(TestData.testWinningStates.playerGreen), Color.EColor.GREEN);
            assert.strictEqual(GS.getWinner(TestData.testWinningStates.playerYellow), Color.EColor.YELLOW);
            assert.strictEqual(GS.getWinner(TestData.testWinningStates.playerBlue), Color.EColor.BLUE);
        });

        it('should return null if game is not over yet', () => {
            assert(null === GS.getWinner(TestData.testAdvancedMoves.game));
            assert(null === GS.getWinner(TestData.testMovesOfRoles.game));
            assert(null === GS.getWinner(TestData.testShrinkingOfBoard.game));
            assert(null === GS.getWinner(TestData.testSpecialCase.game));
            assert(null === GS.getWinner(TestData.testSpecialCaseWinning.game));
        });
    });

    describe('isGameOver()', () => {
        it('should return true if there is just one player left', () => {
            assert(GS.isGameOver(TestData.testWinningStates.playerRed));
            assert(GS.isGameOver(TestData.testWinningStates.playerGreen));
            assert(GS.isGameOver(TestData.testWinningStates.playerYellow));
            assert(GS.isGameOver(TestData.testWinningStates.playerBlue));
            assert(GS.isGameOver(TestData.testSpecialCaseWinning.beatingBeingTrappedButWinning.game));
        });

        it('should return false if there pawns of more than one player left', () => {
            assert(!GS.isGameOver(TestData.testAdvancedMoves.game));
            assert(!GS.isGameOver(TestData.testMovesOfRoles.game));
            assert(!GS.isGameOver(TestData.testShrinkingOfBoard.game));
            assert(!GS.isGameOver(TestData.testSpecialCase.game));
            assert(!GS.isGameOver(TestData.testSpecialCaseWinning.game));
        });
    });

    it('getNextGameStates()', () => {
        const Games = GS.getNextGameStates(TestData.testMovesOfRoles.game);

        const numOfMoves = 0
            + TestData.testMovesOfRoles.validBishopMoves.length
            + TestData.testMovesOfRoles.validKnightMoves.length
            + TestData.testMovesOfRoles.validRookMoves.length
            + TestData.testMovesOfRoles.validQueenMoves.length;

        assert.strictEqual(Games.length, numOfMoves);
    });
});

//*/