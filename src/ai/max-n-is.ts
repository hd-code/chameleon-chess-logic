import { IGameState, ERole } from '../types';

import { TPlayerScore, normalizeScore, getZeroScore } from './player-score';
import { getFieldColor } from '../models/board';
import { isGameOver, getNextGameStates } from '../models/game-state';

// -----------------------------------------------------------------------------

export function maxNIS(gameState: IGameState, depth: number, parentsBestScore = 0): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalFunc(gameState);
        return normalizeScore(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const maxScore = MAX_SCORE - parentsBestScore; // immediate & shallow pruning
    
    let bestScore = maxNIS(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = maxNIS(nextGSs[i], depth - 1, bestScore[player]);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}

// -----------------------------------------------------------------------------

const MAX_SCORE = 1

const MRoleScore100 = {
    [ERole.KNIGHT]: 101,
    [ERole.BISHOP]: 102,
    [ERole.ROOK]:   103,
    [ERole.QUEEN]:  105,
};

function evalFunc(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        const fieldColor = getFieldColor(pawn.position);
        const role = pawn.roles[fieldColor];
        result[pawn.player] += MRoleScore100[role];
    }

    return result;
}