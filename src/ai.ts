import { EColor, BOARD } from "./basic";
import { nextMoves, getIOfPawn } from "./pawns";
import { IGameState, isGameOn, getNextPossibleGameStates } from "./gameState";
import { deepClone } from "./helper";

/* --------------------------------- Public --------------------------------- */

export function makeBestMove(gs: IGameState): IGameState {
    const nextGSs = getNextPossibleGameStates(gs)

    const recursionDepth = setRecursion(gs)

    const weightedGSs = nextGSs.map(cGS => ({
        gs: cGS,
        score: evalGS(cGS, recursionDepth, DEFAULT_SCORE)
    }))

    const orderedGSs = weightedGSs.sort((a,b) => {
        const diff =  calcPlayerScore(b.score, gs.whoseTurn)
                    - calcPlayerScore(a.score, gs.whoseTurn)
        return diff === 0 ? Math.random() * 2 - 1 : diff
    })

    return orderedGSs[0].gs
}

/* --------------------------------- Intern --------------------------------- */

const DEFAULT_SCORE_VAL = 1000
const DEFAULT_SCORE = {
    [EColor.RED]:    DEFAULT_SCORE_VAL,
    [EColor.GREEN]:  DEFAULT_SCORE_VAL,
    [EColor.YELLOW]: DEFAULT_SCORE_VAL,
    [EColor.BLUE]:   DEFAULT_SCORE_VAL
}
const PAWN_VALUE = 100

function setRecursion(gs: IGameState): number {
    const numOfPawns = gs.pawns.length
    return numOfPawns <=  2 ? 6
        :  numOfPawns <=  3 ? 4
        :  numOfPawns <=  6 ? 2
        :  1
}

type Score = {[player in EColor]: number}

function evalGS(gs: IGameState, depth: number, _score: Score): Score {
    // if gameOver or depth = 0, getScore -> recursion anchor
    if (!isGameOn(gs) || !depth)
        return getScore(gs)

    // init result score and get all possible moves/their corresponding GameStates
    let score = deepClone(_score)
    const moves = getNextPossibleGameStates(gs)

    // loop through all moves, take the best move's score
    for (let i = 0, ie = moves.length; i < ie; i++) {
        const moveScore = evalGS(moves[i], depth - 1, score)

        const playerScore = calcPlayerScore(score, gs.whoseTurn)
        const playerMoveScore = calcPlayerScore(moveScore, gs.whoseTurn)

        if (playerMoveScore > playerScore)
            score = moveScore
    }

    return score
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
    return pawns.length * PAWN_VALUE + pawns.reduce((result, pawn) => {
        const pawnI = getIOfPawn(pawn, gs.pawns)
        return result + nextMoves(pawnI, gs.pawns, gs.limits, BOARD).length
    }, 0)
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