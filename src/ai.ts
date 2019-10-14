import { GameState, Position, Color, Meeple } from "./main";
import { makeMove, isGameOn } from "./gameState";

export function makeBestMove(gs: GameState): GameState {
    return gs
}

interface Move {
    meeple: number
    destination: Position
}

type Score = {[player in Color]: number}

function calcBestMove(gs: GameState): Move {
    return {meeple: 2, destination: {row: 0, col: 0}}
}

function evalMove(gs: GameState, move: Move, depth: number, score?: Score, formerPlayer?: Color): Score {
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

function evalGS(gs: GameState): Score {
    return {
        [Color.RED]: countMeeples(gs.meeples, Color.RED),
        [Color.GREEN]: countMeeples(gs.meeples, Color.GREEN),
        [Color.YELLOW]: countMeeples(gs.meeples, Color.YELLOW),
        [Color.BLUE]: countMeeples(gs.meeples, Color.BLUE),
    }
}

function countMeeples(meeples: Meeple[], player: Color): number {
    return meeples.reduce((result, meeple) => {
        return (meeple.player === player ? 1 : -1) + result
    }, 0)
}