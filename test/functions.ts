/**
 * @file
 * This file contains unit tests for all functions in the public API.
 */

import assert from 'assert';
import * as API from '../src/functions';
import { TestData, TestMoves } from './test-data';

import { EFieldColor, EPlayer, IGameState, IPosition } from '../src/types';

import { isFieldColor } from '../src/models/board';
import { isGameState } from '../src/models/game-state';
import { isSmallestLimits } from '../src/models/limits';
import { isInPositions } from '../src/models/position';

import { deepClone, isArray } from '../lib/obray';

// -----------------------------------------------------------------------------

const playerConfigs = [
    [ false, false, true, true ],
    [ false, true, false, true ],
    [ true, false, false, true ],
    [ false, true, true, false ],
    [ true, false, true, false ],
    [ true, true, false, false ],
    [ false, true, true, true ],
    [ true, false, true, true ],
    [ true, true, false, true ],
    [ true, true, true, false ],
    [ true, true, true, true ],
];

describe('API', () => {
    describe('getBoard()', () => {
        it('should return an 2 dimensional array (8x8) of field colors', () => {
            const numRowsAndCols = 8;
            const board = API.getBoard();

            assert.strictEqual(board.length, numRowsAndCols);
            board.forEach(row => {
                assert.strictEqual(row.length, numRowsAndCols);
                assert(isArray(row, isFieldColor));
            });
        });

        it('should have the correct field color at the given position', () => {
            const board = API.getBoard();

            const testData = [
                { row: 0, col: 0, expected: EFieldColor.BLUE },
                { row: 7, col: 0, expected: EFieldColor.RED },
                { row: 7, col: 1, expected: EFieldColor.GREEN },
                { row: 7, col: 2, expected: EFieldColor.YELLOW },
                { row: 7, col: 3, expected: EFieldColor.BLUE },
                { row: 3, col: 3, expected: EFieldColor.YELLOW },
                { row: 3, col: 4, expected: EFieldColor.GREEN },
                { row: 4, col: 3, expected: EFieldColor.BLUE },
                { row: 4, col: 4, expected: EFieldColor.RED },
            ];
            testData.forEach(({row,col,expected}) => {
                const actual = board[row][col];
                assert.strictEqual(actual, expected);
            });
        });
    });

    describe('beginGame()', () => {
        it('should return valid game states for two or more players', () => {
            const testData = playerConfigs;
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);
                assert(isGameState(gs));
            });
        });

        it('should return null for games with less than two players', () => {
            const testData = [
                [ false, false, false, false ],
                [ false, false, false, true ],
                [ false, false, true, false ],
                [ false, true, false, false ],
                [ true, false, false, false ],
            ];
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                assert.strictEqual(gs, null);
            });
        });

        it('should always be player reds turn when red is playing', () => {
            const expected = EPlayer.RED;

            const testData = playerConfigs.filter(conf => conf[0]);
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);
                const actual = gs.player;
                assert.strictEqual(actual, expected);
            });
        });

        it('should not be player reds turn when red is not playing', () => {
            const expected = EPlayer.RED;

            const testData = playerConfigs.filter(conf => !conf[0]);
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);
                const actual = gs.player;
                assert.notStrictEqual(actual, expected);
            });
        });

        it('should should always have 4 pawns per player initially', () => {
            const pawnsPerPlayer = 4;

            const testData = playerConfigs;
            testData.forEach((config, i) => {
                const [a,b,c,d] = config;
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);

                const numOfPlayers = config.filter(p => p).length;

                const expected = numOfPlayers * pawnsPerPlayer;
                const actual = gs.pawns.length;

                assert.strictEqual(actual, expected);
            });
        });

        it('should should never have the smallest possible limits on start', () => {
            const testData = playerConfigs;
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);
                assert(!isSmallestLimits(gs.limits));
            });
        });
    });

    describe('getIndexOfPawnAtPosition()', () => {
        it('should return the correct index for a pawn at the given position', () => {
            const gs = TestData.gameState;
            gs.pawns.forEach((pawn, index) => {
                const expected = index;
                const actual = API.getIndexOfPawnAtPosition(gs, pawn.position);
                assert.strictEqual(actual, expected);
            });
        });

        it('should return -1 for all positions where there is no pawn', () => {
            const expected = -1;

            const gs = TestData.gameState;
            const pawnPositions = gs.pawns.map(pawn => pawn.position);

            let positions: IPosition[] = [];
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    positions.push({ row: i, col: j });
                }
            }
            positions = positions.filter(position => !isInPositions(position, pawnPositions));

            positions.forEach(position => {
                const actual = API.getIndexOfPawnAtPosition(gs, position);
                assert.strictEqual(actual, expected);
            });
        });
    });
    
    describe('makeMove()', () => {
        it('should return an altered game state for all possible moves', () => {
            const gs = TestData.gameState;

            const pawnIs = gs.pawns.map((_,i) => i);
            const pawnsIOnTurn = pawnIs.filter(i => gs.pawns[i].player === gs.player);

            pawnsIOnTurn.forEach(pawnI => {
                const moves = API.getMoves(gs, pawnI);
                moves.forEach(move => {
                    const resultingGS = API.makeMove(gs, pawnI, move);
                    assert.notDeepStrictEqual(resultingGS, gs);
                });
            });
        });

        it('should return null for all possible moves of pawns not on turn', () => {
            const expected = null;

            const gs = TestData.gameState;

            const pawnIs = gs.pawns.map((_,i) => i);
            const pawnsINotOnTurn = pawnIs.filter(i => gs.pawns[i].player !== gs.player);

            pawnsINotOnTurn.forEach(pawnI => {
                const moves = API.getMoves(gs, pawnI);
                moves.forEach(move => {
                    const actual = API.makeMove(gs, pawnI, move);
                    assert.strictEqual(actual, expected);
                });
            });
        });

        it('should do all test moves correctly', () => {
            TestMoves.allMoves.forEach((testCase, i) => {
                const expected = testCase.resultGS;
                const actual = API.makeMove(testCase.gameState, testCase.pawnIndex, testCase.destination);
                assert.deepStrictEqual(actual, expected, 'at: '+i);
            });
        });
    });
    
    it('makeComputerMove() - cannot be tested with ts-node, see integration tests');
    
    describe('isGameOver()', () => {
        it('should return false for newly started games', () => {
            const testData = playerConfigs;
            testData.forEach(([a,b,c,d]) => {
                const gs = API.beginGame(a,b,c,d);
                assert(!API.isGameOver(gs as IGameState));
            });
        });

        it('should return false for all test move game states', () => {
            TestMoves.allMoves.forEach(testCase => assert(!API.isGameOver(testCase.gameState)));
        });

        it('should return true for any game state when there are just pawns of a single player left', () => {
            const testData = TestMoves.allMoves.map(move => {
                let gs = deepClone(move.gameState);
                gs.pawns = gs.pawns.filter(pawn => pawn.player === gs.player);
                return gs;
            });
            testData.forEach(gs => assert(API.isGameOver(gs)));
        });
    });
    
    describe('isGameState()', () => {
        it('should return true for all kinds of starting game states', () => {
            let testData = playerConfigs;
            testData.forEach(([a,b,c,d], i) => {
                const gs = API.beginGame(a,b,c,d);
                if (gs === null) throw new Error('unexpected null at: '+i);
                assert(API.isGameState(gs));
            });
        });

        it('should return true for all test game states', () => {
            TestMoves.allMoves.forEach(({gameState: gs}) => assert(API.isGameState(gs)));
        });

        it('should return false, when there are no pawns', () => {
            let gs = deepClone(TestData.gameState);
            gs.pawns = [];
            assert(!API.isGameState(gs));
        });

        it('should return false, when there are two pawns on the same field', () => {
            let gs = deepClone(TestData.gameState);
            gs.pawns[0].position = gs.pawns[1].position;
            assert(!API.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the global limits (9,9)', () => {
            let gs = deepClone(TestData.gameState);
            gs.pawns[0].position = { row: 9, col: 9 };
            assert(!API.isGameState(gs));
        });

        it('should return false, when there is a pawn outside the limits of a shrunken field', () => {
            let gs = deepClone(TestData.gameState);
            gs.pawns[0].position = { row: 0, col: 0 };
            assert(!API.isGameState(gs));
        });

        it('should return false, when the player on turn is no longer alive', () => {
            let gs = deepClone(TestData.gameState);
            gs.player = EPlayer.BLUE;
            assert(!API.isGameState(gs));
        });
        
        it('should return false for incomplete game states', () => {
            const limits = TestData.gameState.limits;

            const testData = [
                { limits, pawns:[], player: 0 },
                { limits, pawns:[] },
                { limits,           player: 0 },
                {         pawns:[], player: 0 },
            ];
            testData.forEach(gs => assert(!API.isGameState(gs)));
        });

        it('should return false for wrong data types (obj,array,string,boolean,null,undefined)', () => {
            const testData = [
                {street:'Baker Street',houseNo:2}, [1,2,3,4], ' ',
                true, null, undefined
            ];
            testData.forEach(data => assert(!API.isGameState(data)));
        });
    });
    
    describe('isPlayersAlive()', () => {
        it('should return the same booleans for start game states as the start config', () => {
            const testData = playerConfigs.map(config => ({
                0: config[0], 1: config[1], 2: config[2], 3: config[3], 
            }));
            testData.forEach((config, i) => {
                const gs = API.beginGame(config[0], config[1], config[2], config[3]);
                if (gs === null) throw new Error('unexpected null at: '+i);

                const expected = config;
                const actual = API.isPlayersAlive(gs);

                assert.deepStrictEqual(actual, expected);
            });
        });

        it('should work for alle test game states', () => {
            TestMoves.allMoves.forEach(({gameState}) => {
                const expected = {
                    0: gameState.pawns.filter(p => p.player === 0).length > 0,
                    1: gameState.pawns.filter(p => p.player === 1).length > 0,
                    2: gameState.pawns.filter(p => p.player === 2).length > 0,
                    3: gameState.pawns.filter(p => p.player === 3).length > 0,
                };
                const actual = API.isPlayersAlive(gameState);

                assert.deepStrictEqual(actual, expected);
            });
        });
    });
});