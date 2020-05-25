import { isGameOver, getNextGameStates } from '../models/game-state';
import { getMoves } from '../models/pawn';
import { IGameState, EPlayer } from '../types';
import { flattenArray, deepClone } from '../../lib/aux';

// -----------------------------------------------------------------------------

/**
 * The computer will make a move and return the updated game state.
 * @param gs The current game state.
 */
export function makeComputerMove(gs: IGameState): IGameState {
    return makeMoveMaxN(gs);
}

function makeMoveMaxN(game: IGameState): IGameState {
    const depth = getRecursionDepth(game);
    const nextGameStates = getNextGameStates(game);

    const scoredGS = nextGameStates.map((gs, index) => ({index, score: maxN(gs, depth)}));
    const ordered = scoredGS.sort( (a,b) => b.score[game.player] - a.score[game.player] );

    const resultI = ordered[1] && ordered[1].score[game.player] === ordered[0].score[game.player]
        && Math.round(Math.random()) ? ordered[1].index : ordered[0].index;

    return nextGameStates[resultI];
}

function makeMoveHypermax(game: IGameState): IGameState {
    const depth = HYPERMAX_DEPTH;
    const nextGameStates = getNextGameStates(game);

    const scoredGS = nextGameStates.map((game, index) => ({index, score: hypermax(game, depth, INIT_ALPHA)}));
    const ordered = scoredGS.sort( (a,b) => b.score[game.player] - a.score[game.player] );

    const resultI = ordered[1] && ordered[1].score[game.player] === ordered[0].score[game.player]
        && Math.round(Math.random()) ? ordered[1].index : ordered[0].index;

    return nextGameStates[resultI];
}

// -----------------------------------------------------------------------------

type TPlayerScore = {[color in EPlayer]: number};

const PAWN_VALUE = 100;
const HYPERMAX_DEPTH = 5;
const INIT_ALPHA: TPlayerScore = { 0:-Infinity, 1:-Infinity, 2:-Infinity, 3:-Infinity };

function getRecursionDepth(game: IGameState): number {
    const numOfPawns = game.pawns.length;
    switch (numOfPawns) {
        case  2: return 8;
        case  3: return 6;
        case  4: return 2;
        case  5: return 2;
        case  6: return 2;
        default: return 1;
    }
}

// -----------------------------------------------------------------------------

function maxN(game: IGameState, depth: number): TPlayerScore {
    if (isGameOver(game) || depth <= 0)
        return calcScore(game);

    const scores = getNextGameStates(game).map(gs => maxN(gs, depth - 1));
    const ordered = scores.sort((a,b) => b[game.player] - a[game.player]);

    return ordered[0];
}

function hypermax(game: IGameState, depth: number, _alpha: TPlayerScore): TPlayerScore {
    if (isGameOver(game) || depth <= 0) return calcScore(game);

    let alpha = deepClone(_alpha);
    const nextMoves = getNextGameStates(game);

    let result: TPlayerScore = { 0:0, 1:0, 2:0, 3:0 };
    for (let i = 0, ie = nextMoves.length; i < ie; i++) {
        const score = hypermax(nextMoves[i], depth - 1, alpha);
        if (i === 0) result = score;
        if (alpha[game.player] < score[game.player]) {
            alpha[game.player] = score[game.player];
            result = score;
        }
        if (calcSum(alpha) >= 0) break;
    }

    return result;
}

// -----------------------------------------------------------------------------

// Calc player score by subtracting the average score from the individual
// player's score.
function calcScore(game: IGameState): TPlayerScore {
    const absolutePlayerScores = evalPlayers(game);
    const avg = calcSum(absolutePlayerScores) / 4;
    return {
        [EPlayer.RED]: absolutePlayerScores[EPlayer.RED] - avg,
        [EPlayer.GREEN]: absolutePlayerScores[EPlayer.GREEN] - avg,
        [EPlayer.YELLOW]: absolutePlayerScores[EPlayer.YELLOW] - avg,
        [EPlayer.BLUE]: absolutePlayerScores[EPlayer.BLUE] - avg,
    };
}

function calcSum(score: TPlayerScore): number {
    return score[0] + score[1] + score[2] + score[3];
}

// evaluate all players separately
function evalPlayers(game: IGameState): TPlayerScore {
    return {
        [EPlayer.RED]: evalPlayer(game, EPlayer.RED),
        [EPlayer.GREEN]: evalPlayer(game, EPlayer.GREEN),
        [EPlayer.YELLOW]: evalPlayer(game, EPlayer.YELLOW),
        [EPlayer.BLUE]: evalPlayer(game, EPlayer.BLUE),
    };
}

// heuristic evaluation function:
//      number of pawns player has left * PAWN_VALUE -> 100
//    + number of moves the pawns can do on next turn
function evalPlayer(game: IGameState, player: EPlayer): number {
    const pawnIs = game.pawns.reduce(
        (result, pawn, i) => pawn.player === player ? [i, ...result] : result,
        <number[]>[]
    );
    const movesPerPawn = pawnIs.map(pawnI => getMoves(pawnI, game.pawns, game.limits));
    return pawnIs.length * PAWN_VALUE + flattenArray(movesPerPawn).length;
}