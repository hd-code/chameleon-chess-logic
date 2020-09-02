// import { splitEqual } from '../../lib/obray';

import { IGameState, EPlayer } from '../types';
import { maxNIS } from './max-n-is';
import { findMaxScoreIndex } from './player-score';
// import { WorkerInput, WorkerOutput, initWorker } from './worker';
import { getNextGameStates } from '../models/game-state';

// -----------------------------------------------------------------------------

export async function makeComputerMove(gameState: IGameState): Promise<IGameState> {
    // return computerMoveParallel(gameState, 1000, 3);
    return computerMove(gameState, 1000);
}

// -----------------------------------------------------------------------------

async function computerMove(gameState: IGameState, _time: number): Promise<IGameState> {
    return new Promise<IGameState>((resolve, reject) => {
        // set timer for timeout error
        const error = () => reject('calculation took too long');
        const errorHandle = setTimeout(error, TIMEOUT);

        // init time vars
        const time = _time * 0.8;
        const begin = Date.now();

        // init needed values
        const player = gameState.player;
        const nextGSs = getNextGameStates(gameState);

        // init scores
        let scores = nextGSs.map(gs => maxNIS(gs, 0));

        // define done function
        const done = () => {
            const bestMoveI = findMaxScoreIndex(scores, player);
            const bestGS = nextGSs[bestMoveI];
            resolve(bestGS);
            clearTimeout(errorHandle);
        };

        // prepare var for depth and move tracking
        let depth = 1;
        let move = 0;
        const numOfMoves = nextGSs.length;

        // runs calculation again and again, as long within time
        const calc = function calc() {
            scores[move] = maxNIS(nextGSs[move], depth);
            move++;

            if (move >= numOfMoves) {
                move = 0;
                depth++;
            }

            if (Date.now() - begin < time) {
                setImmediate(calc);
            } else {
                done()
            }
        }

        // start calculation
        calc();
    });
}

// -----------------------------------------------------------------------------

const TIMEOUT = 5000;

/* Disable for react native

async function computerMoveParallel(gameState: IGameState, time: number, _numOfWorkers: number): Promise<IGameState> {
    return new Promise((resolve, reject) => {
        // set timer for timeout error
        const error = () => reject('calculation took too long');
        const errorHandle = setTimeout(error, TIMEOUT);

        // init needed values
        const player = gameState.player;
        const nextGSs = getNextGameStates(gameState);
        const numOfWorkers = Math.min(_numOfWorkers, nextGSs.length);
        const workerInputs = makeWorkerInputs(player, nextGSs, numOfWorkers);

        // calc scores for each next game state to have a baseline
        let scores = nextGSs.map(gs => maxNIS(gs, 0));
        const callback = ({index, score}: WorkerOutput) => {
            scores[index] = score;
        };

        // creates the worker threads and makes them ready for execution
        const { startWorkers, destroyWorkers } = initWorkers(numOfWorkers, workerInputs, callback);

        // this is executed, when the time for a move has run out
        const done = () => {
            const bestIndex = findMaxScoreIndex(scores, player);
            const result = nextGSs[bestIndex];
            resolve(result);

            destroyWorkers();
            clearTimeout(errorHandle);
        };

        // start workers and timer for finishing execution
        startWorkers();
        setTimeout(done, time);    
    });
}

function initWorkers(numOfWorkers: number, workerInputs: WorkerInput[], callback: (data: WorkerOutput) => void) {
    let workers = createWorkers(numOfWorkers, callback);

    const startWorkers = () => {
        for (let i = 0, ie = workers.length; i < ie; i++) {
            workers[i].postMessage(workerInputs[i]);
        }
    };

    const destroyWorkers = () => {
        for (let i = 0, ie = workers.length; i < ie; i++) {
            workers[i].terminate();
        }
    };

    return { startWorkers, destroyWorkers };
}

function createWorkers(numOfWorkers: number, callback: (data: WorkerOutput) => void) {
    let workers = [];
    for (let i = 0; i < numOfWorkers; i++) {
        workers[i] = initWorker(callback);
    }
    return workers;
}

function makeWorkerInputs(player: EPlayer, gameStates: IGameState[], numOfWorkers: number): WorkerInput[] {
    const gsIndex = gameStates.map((gs, i) => ({ index: i, gameState: gs }));
    const gsIndexPerWorker = splitEqual(gsIndex, numOfWorkers);
    return gsIndexPerWorker.map(gameStates => ({ player, gameStates: gameStates }));
}

//*/