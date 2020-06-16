import assert from 'assert';
import * as API from '../src/functions';

import { isFieldColor } from '../src/models/board';
import { isGameState } from '../src/models/game-state';

import { deepClone } from '../lib/aux';
import { isArray, hasKey, isBool } from '../lib/type-guards';

import { TestData, TestMoves } from './test-data';
import { EPlayer } from '../src/types';

// -----------------------------------------------------------------------------

// TODO: focus more on testing the public API

describe('API', () => {
    // TODO
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
    });

    // TODO
    describe('beginGame()', () => {
        it('should return valid game states for two players or more', () => {
            const testCases = [
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
            testCases.forEach(([a,b,c,d]) => {
                const gs = API.beginGame(a,b,c,d);
                assert(isGameState(gs));
            });
        });

        it('should return null for games with less than two players', () => {
            const testCases = [
                [ false, false, false, false ],
                [ false, false, false, true ],
                [ false, false, true, false ],
                [ false, true, false, false ],
                [ true, false, false, false ],
            ];
            testCases.forEach(([a,b,c,d]) => {
                const gs = API.beginGame(a,b,c,d);
                assert.strictEqual(gs, null);
            });
        });

        it('is tested thoroughly in models/game-state', () => {});
    });

    // TODO
    describe('getIndexOfPawnAtPosition()', () => {
        it('should return the correct index for a pawn at the given position', () => {
            const gs = TestData.gameState;
            gs.pawns.forEach(
                (pawn, index) => assert.strictEqual(API.getIndexOfPawnAtPosition(gs, pawn.position), index)
            );
        });

        it('should return -1 when there is no pawn at the specified position (0,0),(3,3),(4,6)', () => {
            const expected = -1;

            const gs = TestData.gameState;
            const testData = [
                { row: 0, col: 0 },
                { row: 3, col: 3 },
                { row: 4, col: 6 },
            ];

            testData.forEach(position => {
                const actual = API.getIndexOfPawnAtPosition(gs, position);
                assert.strictEqual(actual, expected);
            });
        });
    });
    
    // TODO
    describe('makeMove()', () => {
        it('should return an altered game state for all possible moves', () => {
            const gs = TestData.gameState;

            const pawnsIOnTurn = gs.pawns.reduce((result, pawn, i) => {
                return pawn.player === gs.player
                    ? result.concat(i)
                    : result;
            }, <number[]>[]);

            pawnsIOnTurn.forEach(pawnI => {
                const moves = API.getMoves(gs, pawnI);
                moves.forEach(move => {
                    const resultingGS = API.makeMove(gs, pawnI, move);
                    assert.notDeepStrictEqual(resultingGS, gs);
                });
            });
        });

        it('should return null for all possible moves of pawns not on turn', () => {
            const gs = TestData.gameState;

            const pawnsINotOnTurn = gs.pawns.reduce((result, pawn, i) => {
                return pawn.player !== gs.player
                    ? result.concat(i)
                    : result;
            }, <number[]>[]);

            pawnsINotOnTurn.forEach(pawnI => {
                const moves = API.getMoves(gs, pawnI);
                moves.forEach(move => {
                    const result = API.makeMove(gs, pawnI, move);
                    assert.strictEqual(result, null);
                });
            });
        });

        it('should do all test moves correctly', () => {
            TestMoves.allMoves.forEach((testCase, index) => {
                const expected = testCase.resultGS;
                const actual = API.makeMove(testCase.gameState, testCase.pawnIndex, testCase.destination);
                assert.deepStrictEqual(actual, expected, 'testCase ' + index + ' failed');
            });
        });
    });
    
    // TODO
    describe('makeComputerMove()', () => {
        it('cannot be tested with mocha – worker scripts cannot be initialized', () => {});
    });
    
    // TODO
    describe('isGameOver()', () => {
        it('should return false for newly started games', () => {
            const testCases = [
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

            testCases.forEach(([a,b,c,d]) => {
                const gs = API.beginGame(a,b,c,d);
                assert(!API.isGameOver(gs));
            });
        });

        it('should return false for all test move game states', () => {
            TestMoves.allMoves.forEach(testCase => {
                assert(!API.isGameOver(testCase.gameState));
            });
        });

        it('should return true for any game state when there are just pawns of a single player left', () => {
            const testCases = TestMoves.allMoves.map(move => {
                let gs = deepClone(move.gameState);
                gs.pawns = gs.pawns.filter(pawn => pawn.player === gs.player);
                return gs;
            });
            testCases.forEach(gs => assert(API.isGameOver(gs)));
        });
    });
    
    // TODO
    describe('isGameState()', () => {
        it('is tested thoroughly in models/game-state', () => {});
    });
    
    // TODO
    describe('isPlayersAlive()', () => {
        it('should return a map from EPlayer to boolean', () => {
            const gs = TestData.gameState;

            const actual = API.isPlayersAlive(gs);

            assert(hasKey(actual, EPlayer.RED, isBool));
            assert(hasKey(actual, EPlayer.GREEN, isBool));
            assert(hasKey(actual, EPlayer.YELLOW, isBool));
            assert(hasKey(actual, EPlayer.BLUE, isBool));
        });

        it('is tested thoroughly in models/player', () => {});
    });
});