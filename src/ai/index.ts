import { IGameState } from '../types';

import Worker from './worker';

// -----------------------------------------------------------------------------

/** Calculation takes a little more than 1 second. Promise will reject after 5 seconds. */
export async function makeComputerMove(gameState: IGameState): Promise<IGameState> {
    return new Promise<IGameState>((resolve, reject) => {
        const timeout = setTimeout(error, TIMEOUT);
        
        const worker = new Worker;
        worker.registerCallback(success);
        worker.run(gameState);

        function success(nextGameState: IGameState) {
            resolve(nextGameState);
            setImmediate(cleanup);
        }

        function error() {
            reject(new Error('Timeout - calculation took too long'));
            setImmediate(cleanup);
        }

        function cleanup() {
            clearTimeout(timeout);
            worker.delete();
        }
    });
}

// -----------------------------------------------------------------------------

const TIMEOUT = 5000;