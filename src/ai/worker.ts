import { isMainThread, parentPort, Worker } from 'worker_threads';

import { IGameState, EPlayer } from '../types';

import { maxNIS } from './max-n-is';
import { TPlayerScore } from './player-score';

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

export interface WorkerInput {
    player: EPlayer;
    gameStates: {
        index: number;
        gameState: IGameState;
    }[];
}

export interface WorkerOutput {
    index: number;
    score: TPlayerScore;
}

/**
 * Initializes a new worker thread to calculate scores for a list game states.
 */
export function initWorker(callback: (data: WorkerOutput) => void): Worker {
    const worker = new Worker(__filename);
    worker.on('message', callback);
    return worker;
}

// -----------------------------------------------------------------------------
// Execution of Worker Script
// -----------------------------------------------------------------------------

!isMainThread && parentPort?.on('message', main);

// -----------------------------------------------------------------------------

const MAX_DEPTH = 50;

function main(input: WorkerInput) {
    const player = input.player;
    let depth = 1;

    // runs until max depth is reached or the worker script is terminated in the
    // main thread
    while (depth < MAX_DEPTH) {
        let bestScore = 0;
        for (let i = 0, ie = input.gameStates.length; i < ie; i++) {
            const { index, gameState } = input.gameStates[i];

            const score = maxNIS(gameState, depth, bestScore);
            if (bestScore < score[player]) {
                bestScore = score[player];
            }

            // always post a new score when it is available
            parentPort?.postMessage(<WorkerOutput>{ index, score });
        }
        depth += 1;
    }
}