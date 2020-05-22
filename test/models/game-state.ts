import assert from 'assert';
import * as GS from '../../src/models/game-state';

import { getStartLimits, calcLimits } from '../../src/models/limits';
import { EPlayer } from '../../src/types';

import { dec2binArray } from '../../lib/aux';

import * as TestData from '../test-data';

// -----------------------------------------------------------------------------

describe('models/game-state', () => {
    describe('isGameState()', () => {
        it('should return true for all kinds of starting game states (except no players)', () => {
            for (let i = 1, ie = 16; i < ie; i++) {
                const configTmp = dec2binArray(i, 4);
                const config = configTmp.map(x => x === 1);
                const gs = GS.getStartGameState(config as any);
                assert(GS.isGameState(gs));
            }
        });

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

    // TODO: testing
    describe('isValidMove()', () => {});

    // TODO: testing
    describe('updateGameState()', () => {});

    describe('isGameOver()', () => {
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

        // TODO: test other, none initial game states
    });

    // TODO: do further tests
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