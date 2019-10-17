import { IGameState, IPosition, EColor, IMeeple } from "./main";
import { makeMove, isGameOn } from "./gameState";

export function makeBestMove(gs: IGameState): IGameState {
    return gs
}

interface Move {
    meeple: number
    destination: IPosition
}

type Score = {[player in EColor]: number}

function calcBestMove(gs: IGameState): Move {
    return {meeple: 2, destination: {row: 0, col: 0}}
}

function evalMove(gs: IGameState, move: Move, depth: number, score?: Score, formerPlayer?: EColor): Score {
    const newGS = makeMove(gs, move.meeple, move.destination)
    if (!depth || !isGameOn(newGS))
        return evalGS(newGS)

    // TODO!!!...

    return {
        0: 0,
        1: 1,
        2: 2,
        3: 3
    }
}

function evalGS(gs: IGameState): Score {
    return {
        [EColor.RED]: countMeeples(gs.meeples, EColor.RED),
        [EColor.GREEN]: countMeeples(gs.meeples, EColor.GREEN),
        [EColor.YELLOW]: countMeeples(gs.meeples, EColor.YELLOW),
        [EColor.BLUE]: countMeeples(gs.meeples, EColor.BLUE),
    }
}

function countMeeples(meeples: IMeeple[], player: EColor): number {
    return meeples.reduce((result, meeple) => {
        return (meeple.player === player ? 1 : -1) + result
    }, 0)
}