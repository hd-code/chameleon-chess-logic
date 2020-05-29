import * as ccl from '../dist';

// -----------------------------------------------------------------------------

describe('Integration test', () => {
    it('should be able to play a random game', () => {
        const board = ccl.getBoard();
        if (!board) throw new Error('could not get board');

        const startGS = ccl.beginGame(true, true, true, true);
        if (!startGS) throw new Error('game state could not be created');

        let gs = startGS

        // these functions are just called, to make sure no exceptions are thrown
        ccl.isGameState(gs);
        ccl.isPlayersAlive(gs);

        let turn = 0;
        while(!ccl.isGameOver(gs) && ++turn < MAX_TURNS) {
            const pawnsOnTurn = gs.pawns.filter(pawn => pawn.player === gs.player);

            const pawn = pawnsOnTurn[getRandomIndex(pawnsOnTurn)];
            const pawnIndex = ccl.getIndexOfPawnAtPosition(gs, pawn.position);

            const moves = ccl.getMoves(gs, pawnIndex);
            const move = moves[getRandomIndex(moves)];

            const nextGS = ccl.makeMove(gs, pawnIndex, move);
            if (nextGS === null) throw new Error('failed to make a move');

            gs = nextGS;
        }

        if (turn >= MAX_TURNS) throw new Error('game did not finish');
    });
});

// -----------------------------------------------------------------------------

const MAX_TURNS = 100;

function getRandomIndex<T>(array: T[]): number {
    return Math.floor(Math.random() * array.length);
}