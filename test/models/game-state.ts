import assert from 'assert';
import * as GS from '../../src/models/game-state';
import { TestData, TestMoves } from '../test-data';

import { EPlayer } from '../../src/types';

import { getStartLimits, calcLimits } from '../../src/models/limits';
import { getMoves } from '../../src/models/pawn';

import { flattenArray, deepClone } from '../../lib/obray';

// -----------------------------------------------------------------------------

describe('models/game-state', () => {
    describe('isGameState()', () => {
        it('should return false, when there are no pawns', () => {
            const gs = GS.getStartGameState([false, false, false, false]);
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there are two pawns on the same field', () => {
            let gs = GS.getStartGameState([true, true, true, true]);
            gs.pawns[0].position = gs.pawns[1].position;
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the global limits (9,9)', () => {
            let gs = GS.getStartGameState([true, true, true, true]);
            gs.pawns[0].position = { row: 9, col: 9 };
            assert(!GS.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the limits of a shrunken field', () => {
            let gs = GS.getStartGameState([true, true, false, false]);
            gs.pawns[0].position = { row: 0, col: 0 };
            assert(!GS.isGameState(gs));
        });

        it('should return false, when the player on turn is no longer alive', () => {
            let gs = GS.getStartGameState([true, true, false, false]);
            gs.player = EPlayer.BLUE;
            assert(!GS.isGameState(gs));
        });
        
        it('should return false for incomplete game states', () => {
            const testData = [
                { limits: {}, pawns:[], player: 0 },
                { limits: {}, pawns:[] },
                { limits: {},           player: 0 },
                {             pawns:[], player: 0 },
            ];
            testData.forEach(limits => assert(!GS.isGameState(limits)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const testData = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            testData.forEach(data => assert(!GS.isGameState(data)));
        });
    });

    describe('getStartGameState()', () => {
        it('should return a game state with 16 pawns, start limits and red on turn for a 4 player game', () => {
            const gs = GS.getStartGameState([true, true, true, true]);
            assert.strictEqual(gs.pawns.length, 16);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 12 pawns, start limits and red on turn for a 3 player game (without blue)', () => {
            const gs = GS.getStartGameState([true, true, true, false]);
            assert.strictEqual(gs.pawns.length, 12);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 12 pawns, start limits and blue on turn for a 3 player game (without red)', () => {
            const gs = GS.getStartGameState([false, true, true, true]);
            assert.strictEqual(gs.pawns.length, 12);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.BLUE);
        });

        it('should return a game state with 8 pawns, start limits and red on turn for a 2 player game (red, yellow)', () => {
            const gs = GS.getStartGameState([true, false, true, false]);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 8 pawns, shrunken limits and red on turn for a 2 player game (red, blue)', () => {
            const gs = GS.getStartGameState([true, false, false, true]);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a game state with 8 pawns, start limits and blue on turn for a 2 player game (green, blue)', () => {
            const gs = GS.getStartGameState([false, true, false, true]);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.BLUE);
        });

        it('should return a game state with 8 pawns, shrunken limits and yellow on turn for a 2 player game (yellow, green)', () => {
            const gs = GS.getStartGameState([false, true, true, false]);
            assert.strictEqual(gs.pawns.length, 8);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.YELLOW);
        });

        it('should return a shrunken game state, with red on turn, when only red is requested', () => {
            const gs = GS.getStartGameState([true, false, false, false]);
            assert.strictEqual(gs.pawns.length, 4);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.RED);
        });

        it('should return a shrunken game state, with green on turn, when only green is requested', () => {
            const gs = GS.getStartGameState([false, true, false, false]);
            assert.strictEqual(gs.pawns.length, 4);
            assert.deepStrictEqual(gs.limits, calcLimits(gs.pawns, getStartLimits()));
            assert.strictEqual(gs.player, EPlayer.GREEN);
        });

        it('should return a game state with no pawns, start limits and red on turn for no players', () => {
            const gs = GS.getStartGameState([false, false, false, false]);
            assert.strictEqual(gs.pawns.length, 0);
            assert.deepStrictEqual(gs.limits, getStartLimits());
            assert.strictEqual(gs.player, EPlayer.RED);
        });
    });

    describe('isValidMove() - uses the TestMoves data set', () => {
        const gs = TestData.gameState;

        it('should return true for all valid knight moves', () => {
            const pawnIndex = TestData.knightIndex;
            const moves = TestData.knightMoves;
            moves.forEach(move => assert(GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return true for all valid rook moves', () => {
            const pawnIndex = TestData.rookIndex;
            const moves = TestData.rookMoves;
            moves.forEach(move => assert(GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return false for all valid bishop moves (player not on turn)', () => {
            const pawnIndex = TestData.bishopIndex;
            const moves = TestData.bishopMoves;
            moves.forEach(move => assert(!GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return false for all valid queen moves (player not on turn)', () => {
            const pawnIndex = TestData.queenIndex;
            const moves = TestData.queenMoves;
            moves.forEach(move => assert(!GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return false when the pawn does not exist', () => {
            const pawnIndex = gs.pawns.length;
            const moves = TestData.knightMoves.concat(TestData.rookMoves);
            moves.forEach(move => assert(!GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return false when the moves can not be done by the pawn', () => {
            const pawnIndex = TestData.knightIndex;
            let moves = deepClone(TestData.knightMoves);
            moves.forEach(move => move.row += 1);
            moves.forEach(move => assert(!GS.isValidMove(gs, pawnIndex, move)));
        });

        it('should return true for all test moves', () => {
            TestMoves.allMoves.forEach(testCase => {
                assert(GS.isValidMove(testCase.gameState, testCase.pawnIndex, testCase.destination));
            });
        });
    });

    describe('updateGameState()', () => {
        it('should return the correct game state for all test moves', () => {
            TestMoves.allMoves.forEach((testCase, index) => {
                const expected = testCase.resultGS;
                const actual = GS.updateGameState(testCase.gameState, testCase.pawnIndex, testCase.destination);
                assert.deepStrictEqual(actual, expected, 'testCase ' + index + ' failed');
            });
        });
    });

    describe('isGameOver()', () => {
        it('should return false for a normal game state in the course of a game', () => {
            const gs = TestData.gameState;
            assert(!GS.isGameOver(gs));
        });

        it('should return false for a new 4 player game', () => {
            const gs = GS.getStartGameState([true, true, true, true]);
            assert(!GS.isGameOver(gs));
        });

        it('should return false for a new 3 player game', () => {
            const gs = GS.getStartGameState([true, true, true, false]);
            assert(!GS.isGameOver(gs));
        });

        it('should return false for a new 2 player game', () => {
            const gs = GS.getStartGameState([true, false, true, false]);
            assert(!GS.isGameOver(gs));
        });

        it('should return true when there is only one pawn left', () => {
            let gs = deepClone(TestData.gameState);
            gs.pawns = [gs.pawns[0]];
            assert(GS.isGameOver(gs));
        });

        it('should return true for a new 1 player game (red)', () => {
            const gs = GS.getStartGameState([true, false, false, false]);
            assert(GS.isGameOver(gs));
        });

        it('should return true for a new 1 player game (green)', () => {
            const gs = GS.getStartGameState([false, true, false, false]);
            assert(GS.isGameOver(gs));
        });

        it('should return true for a new game without players', () => {
            const gs = GS.getStartGameState([false, true, false, false]);
            assert(GS.isGameOver(gs));
        });
    });

    describe('getNextGameStates()', () => {
        it('should return as many game states as possible pawn moves of the player on turn', () => {
            const gs = TestData.gameState;

            const pawnsIOnTurn = gs.pawns.reduce((result, pawn, i) => {
                return pawn.player === gs.player
                    ? result.concat(i)
                    : result;
            }, <number[]>[]);
            
            const moves = pawnsIOnTurn.map(pawnI => getMoves(pawnI, gs.pawns, gs.limits));

            const expected = flattenArray(moves).length;
            const actual = GS.getNextGameStates(gs).length;

            assert.strictEqual(actual, expected);
        });

        it('should return the next possible game states, so, the test move should be among them', () => {
            TestMoves.allMoves.forEach(testCase => {
                let gameStateFound = false;
                const nextGSs = GS.getNextGameStates(testCase.gameState);
                nextGSs.forEach(gs => {
                    try {
                        assert.deepStrictEqual(gs, testCase.resultGS);
                        gameStateFound = true;
                    } catch (e) {}
                });
                assert(gameStateFound);
            });
        });
    });
});