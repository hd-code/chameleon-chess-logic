import { flattenArray } from "../lib/hd-helper";

import { EColor } from "./models/Color";
import { IGameState, isGameOver, getNextPossibleGameStates } from "./models/GameState";
import { getNextMoves, getIndexOfPawn} from "./models/Pawns";

/* --------------------------------- Public --------------------------------- */

export function makeBestMove(gs: IGameState): IGameState {
    const recursionDepth = getRecursionDepth(gs);

    const nextGSs = getNextPossibleGameStates(gs);
    const scores = nextGSs.map(gs => calcDeepScore(gs, recursionDepth));

    const bestIndex = getIndexOfHighestScore(scores, gs.whoseTurn);

    return nextGSs[bestIndex];
}

// -----------------------------------------------------------------------------

function getRecursionDepth(gs: IGameState): number {
    const numOfPawns = gs.pawns.length
    return numOfPawns < 3 ? 4
         : numOfPawns < 5 ? 2
        //  : numOfPawns < 7 ? 2
         : 1
}

const PAWN_VALUE = 100;

type TScore = {[player in EColor]: number}

function getIndexOfHighestScore(scores: TScore[], player: EColor): number {
    let indexScores = scores.map((score,i) => ({index: i, score: calcPlayerScore(score, player)}));

    indexScores.sort((a,b) => b.score - a.score);

    if (indexScores.length > 1 && indexScores[0].score === indexScores[1].score && Math.round(Math.random())) {
        indexScores[0] = indexScores[1];
    }

    return indexScores[0].index;
}

//       scoreOfPlayer - scoresOfOpponents
// =     scoreOfPlayer - scoresOfAllPlayers + scoreOfPlayer
// = 2 * scoreOfPlayer - scoresOfAllPlayers
function calcPlayerScore(score: TScore, player: EColor): number {
    return 2 * score[player] - calcScoreTotal(score)
}

function calcScoreTotal(score: TScore): number {
    return score[EColor.RED] + score[EColor.GREEN] + score[EColor.YELLOW] + score[EColor.BLUE]
}

function calcDeepScore(gs: IGameState, depth: number): TScore {
    if (isGameOver(gs) || depth <= 0)
        return calcScore(gs);

    const nextGSs = getNextPossibleGameStates(gs);
    const scores = nextGSs.map(gs => calcDeepScore(gs, depth - 1));

    const bestIndex = getIndexOfHighestScore(scores, gs.whoseTurn);
    return scores[bestIndex];
}

function calcScore(gs:IGameState): TScore {
    return {
        [EColor.RED]:   evalPlayer(gs, EColor.RED),
        [EColor.GREEN]: evalPlayer(gs, EColor.GREEN),
        [EColor.YELLOW]:evalPlayer(gs, EColor.YELLOW),
        [EColor.BLUE]:  evalPlayer(gs, EColor.BLUE)
    };
}

//   count pawns (-> PAWN_VALUE)
// + counts the number of moves all pawns of a player can do
function evalPlayer(gs: IGameState, player: EColor): number {
    const pawns = gs.pawns.filter(pawn => pawn.player === player);
    
    if (pawns.length === 0)
        return 0;
    
    const pawnsI = pawns.map(pawn => getIndexOfPawn(pawn, gs.pawns));
    const movesPerPawn = pawnsI.map(pawnI => getNextMoves(pawnI, gs.pawns, gs.limits));

    return pawns.length * PAWN_VALUE + flattenArray(movesPerPawn).length;
}