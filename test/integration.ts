/**
 * @file
 * This file holds integration tests. That means that instead of the typescript
 * code, the transpiled javascript code is used. So, these tests can only be run
 * after a build.
 * 
 * This allows also the computer opponent to be tested as worker threads are
 * available in this case.
 */

import assert from 'assert';
import * as ccl from '../dist';

// -----------------------------------------------------------------------------

describe('Integration test', () => {
    it('should be able to play a random game', () => {
        const board = ccl.getBoard();
        if (!board) throw new Error('could not get board');

        const startGS = ccl.beginGame(true, true, true, true);
        if (!startGS) throw new Error('game state could not be created');

        let gs = startGS;

        // these functions are just called, to make sure no exceptions are thrown
        ccl.isGameState(gs);
        ccl.isPlayersAlive(gs);

        let turn = 0;
        while(!ccl.isGameOver(gs) && ++turn < MAX_TURNS) {
            const pawnsOnTurn = gs.pawns.filter(pawn => pawn.player === gs.player);

            const pawn = pawnsOnTurn[getRandomIndex(pawnsOnTurn)];
            const pawnIndex = ccl.getIndexOfPawnAtPosition(gs, pawn.position);

            const moves = ccl.getMoves(gs, pawnIndex);
            const moveI = getRandomIndex(moves);
            const move = moves[moveI];

            const nextGS = ccl.makeMove(gs, pawnIndex, move);

            // it can happen, that a pawn is blocked by other pawns completely
            // if that happens, we just try again
            if (nextGS === null) continue;

            gs = nextGS;
        }

        if (turn >= MAX_TURNS) throw new Error('game did not finish');
    });

    it('should be able to do 1 computer move in about 1 second', async () => {
        const startGS = ccl.beginGame(true, true, true, true);
        if (startGS === null) throw new Error('start game state was null');

        const begin = Date.now();
        const nextGS = await ccl.makeComputerMove(startGS);
        const time = Date.now() - begin;

        assert(ccl.isGameState(nextGS));
        assert.notDeepStrictEqual(nextGS, startGS);
        assert.strictEqual(Math.round(time / 1000), 1);
    });
});

// -----------------------------------------------------------------------------

const MAX_TURNS = 1000;

function getRandomIndex<T>(array: T[]): number {
    return Math.floor(Math.random() * array.length);
}