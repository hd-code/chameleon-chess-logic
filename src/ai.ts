import { EColor, BOARD } from "./basic";
import { IMeeple, nextMoves, getIofMeeple } from "./meeples";
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

function setRecursion(gs: IGameState): number {
    const numOfMeeples = gs.meeples.length
    return numOfMeeples <=  2 ? 6
        :  numOfMeeples <=  3 ? 4
        :  numOfMeeples <=  6 ? 2
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

// counts the number of moves all meeples of a player can do
function evalPlayer(gs: IGameState, player: EColor): number {
    const meeples = gs.meeples.filter(meeple => meeple.player === player)
    return meeples.reduce((result, meeple) => {
        const meepleI = getIofMeeple(meeple, gs.meeples)
        return result + nextMoves(meepleI, gs.meeples, gs.limits, BOARD).length
    }, 0)
}

function calcPlayerScore(score: Score, player: EColor): number {
    return 2 * score[player] - calcScoreTotal(score)
}

function calcScoreTotal(score: Score): number {
    return score[EColor.RED] + score[EColor.GREEN] + score[EColor.YELLOW] + score[EColor.BLUE]
}