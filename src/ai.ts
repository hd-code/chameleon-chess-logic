import { EColor, getBoard } from "./basic";
import { getNextMoves, getIOfPawn } from "./pawns";
import { IGameState, isGameOver, getNextPossibleGameStates } from "./gameState";
import { deepClone } from "./helper";

/* --------------------------------- Public --------------------------------- */

export function makeBestMove(gs: IGameState): IGameState {
    const nextGSs = getNextPossibleGameStates(gs)
    const recursionDepth = getRecurtionDepth(gs)

    const weightedGSs = nextGSs.map(cGS => ({
        gs: cGS,
        score: evalGS(cGS, recursionDepth)
    }))
    const orderedGSs = deepClone(weightedGSs).sort((a,b) => {
        return calcPlayerScore(b.score, gs.whoseTurn)
             - calcPlayerScore(a.score, gs.whoseTurn)
    })

    return orderedGSs[0].gs
}

/* --------------------------------- Intern --------------------------------- */

const PAWN_VALUE = 100
function getRecurtionDepth(gs: IGameState): number {
    const numOfPawns = gs.pawns.length
    return numOfPawns < 3 ? 5
         : numOfPawns < 5 ? 3
         : numOfPawns < 7 ? 2
         : 1
}

type Score = {[player in EColor]: number}

function evalGS(gs: IGameState, depth: number): Score {
    // if gameOver or depth = 0, getScore -> recursion anchor
    if (isGameOver(gs.pawns) || depth <= 0)
        return getScore(gs)

    const moves = getNextPossibleGameStates(gs)
    const moveScores = moves.map(move => evalGS(move, depth - 1))
    const orderedScores = deepClone(moveScores).sort((a,b) => {
        return calcPlayerScore(b, gs.whoseTurn) - calcPlayerScore(a, gs.whoseTurn)
    })

    return orderedScores[0]
}

function getScore(gs:IGameState): Score {
    return {
        [EColor.RED]:   evalPlayer(gs, EColor.RED),
        [EColor.GREEN]: evalPlayer(gs, EColor.GREEN),
        [EColor.YELLOW]:evalPlayer(gs, EColor.YELLOW),
        [EColor.BLUE]:  evalPlayer(gs, EColor.BLUE)
    }
}

//   counts pawns (-> PAWN_VALUE)
// + counts the number of moves all pawns of a player can do
function evalPlayer(gs: IGameState, player: EColor): number {
    const pawns = gs.pawns.filter(pawn => pawn.player === player)
    return pawns.length * PAWN_VALUE + countMovesOfAllPawns(player, gs)
}

function countMovesOfAllPawns(player: EColor, gs: IGameState): number {
    const pawns = gs.pawns.filter(pawn => pawn.player === player)
    const pawnsI = pawns.map(pawn => getIOfPawn(pawn, gs.pawns))
    return pawnsI.reduce((result, pawn) => result + countMovesOfPawn(pawn, gs), 0)
}

function countMovesOfPawn(pawnI: number, gs: IGameState): number {
    return getNextMoves(pawnI, gs.pawns, gs.limits, getBoard()).length
}

//       scoreOfPlayer - scoresOfOpponents
// =     scoreOfPlayer - scoresOfAllPlayers + scoreOfPlayer
// = 2 * scoreOfPlayer - scoresOfAllPlayers
function calcPlayerScore(score: Score, player: EColor): number {
    return 2 * score[player] - calcScoreTotal(score)
}

function calcScoreTotal(score: Score): number {
    return score[EColor.RED] + score[EColor.GREEN] + score[EColor.YELLOW] + score[EColor.BLUE]
}