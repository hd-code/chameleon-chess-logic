import { flattenArray } from '../lib/hd-helper';

import { EColor } from './models/Color';
import { IGame, isGameOver, getNextPossibleGames } from './models/Game';
import { getNextMoves, getIndexOfPawn} from './models/Pawns';

/* --------------------------------- Public --------------------------------- */

export function makeBestMove(game: IGame): IGame {
    const recursionDepth = getRecursionDepth(game);

    const possibleGames = getNextPossibleGames(game);
    const scores = possibleGames.map(game => calcDeepScore(game, recursionDepth));

    const bestIndex = getIndexOfHighestScore(scores, game.whoseTurn);
    return possibleGames[bestIndex];
}

// -----------------------------------------------------------------------------

function getRecursionDepth(game: IGame): number {
    const numOfPawns = game.pawns.length
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

function calcDeepScore(game: IGame, depth: number): TScore {
    if (isGameOver(game) || depth <= 0)
        return calcScore(game);

    const possibleGames = getNextPossibleGames(game);
    const scores = possibleGames.map(game => calcDeepScore(game, depth - 1));

    const bestIndex = getIndexOfHighestScore(scores, game.whoseTurn);
    return scores[bestIndex];
}

function calcScore(game:IGame): TScore {
    return {
        [EColor.RED]:   evalPlayer(game, EColor.RED),
        [EColor.GREEN]: evalPlayer(game, EColor.GREEN),
        [EColor.YELLOW]:evalPlayer(game, EColor.YELLOW),
        [EColor.BLUE]:  evalPlayer(game, EColor.BLUE)
    };
}

//   count pawns (-> PAWN_VALUE)
// + counts the number of moves all pawns of a player can do
function evalPlayer(game: IGame, player: EColor): number {
    const pawns = game.pawns.filter(pawn => pawn.player === player);
    
    if (pawns.length === 0)
        return 0;
    
    const pawnsI = pawns.map(pawn => getIndexOfPawn(pawn, game.pawns));
    const movesPerPawn = pawnsI.map(pawnI => getNextMoves(pawnI, game.pawns, game.limits));

    return pawns.length * PAWN_VALUE + flattenArray(movesPerPawn).length;
}