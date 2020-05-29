import assert from 'assert';
import * as API from '../src/functions';

import { isFieldColor } from '../src/models/board';
import { isGameState } from '../src/models/game-state';

import { isArray, hasKey, isBool } from '../lib/type-guards';

import { TestData } from './test-data';
import { EPlayer } from '../src/types';

// -----------------------------------------------------------------------------

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
    });

    describe('beginGame()', () => {
        it('should return valid game states for two players or more', () => {
            const testCases = [
                API.beginGame(true, true, true, true),
                API.beginGame(false, true, true, true),
                API.beginGame(false, false, true, true),
                API.beginGame(false, true, false, true),
                API.beginGame(false, true, true, false),
                API.beginGame(true, false, true, true),
                API.beginGame(true, false, false, true),
                API.beginGame(true, false, true, false),
                API.beginGame(true, true, false, true),
                API.beginGame(true, true, false, false),
                API.beginGame(true, true, true, false),
            ];
            testCases.forEach(testCase => assert(isGameState(testCase)));
        });

        it('should return null for games with less than two players', () => {
            const testCases = [
                API.beginGame(false, false, false, false),
                API.beginGame(true, false, false, false),
                API.beginGame(false, true, false, false),
                API.beginGame(false, false, true, false),
                API.beginGame(false, false, false, true),
            ];
            testCases.forEach(testCase => assert.strictEqual(testCase, null));
        });

        it('is tested thoroughly in models/game-state', () => {});
    });

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

    });
    
    describe('makeComputerMove()', () => {
        it('cannot be tested with mocha – worker scripts cannot be initialized', () => {});
    });
    
    describe('isGameOver()', () => {
        it('is tested thoroughly in models/game-state', () => {});
    });
    
    describe('isGameState()', () => {
        it('is tested thoroughly in models/game-state', () => {});
    });
    
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