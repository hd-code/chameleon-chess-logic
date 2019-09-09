import { BOARD, EColors, ERoles } from "./basic";
import { IMove, nextMoves, EMoveType, getCurrentRole } from "./meeples";
import { IGameState, isGameStillOn, makeMove } from "./gameState";
import { deepClone } from "./helper";

export function makeAGoodMove(gs :IGameState) :IGameState {
    let initWeights = [0,0,0,0]
    let wgs = {gameState: gs, weights: initWeights}
    let depth = RECURSION_DEPTH

    let result = calcMove(wgs, depth)

    console.log(gs)
    console.log(gs.meeples)
    console.log(gs.whoseTurn, result.weights, gs.meeples.length)

    return result.gameState
}

const RECURSION_DEPTH = 6

const WEIGHT_BOOST_VICTORY = 1000
const WEIGHT_BOOST_BEATING = 20
const WEIGHT_BOOST_KNIGHT  = 0
const WEIGHT_BOOST_QUEEN   = 10
const WEIGHT_BOOST_BISHOP  = 3
const WEIGHT_BOOST_ROOK    = 5

interface IWeightedState {
    gameState: IGameState
    weights: number[] // RED, GREEN, YELLOW, BLUE
}

interface IMeepleMove {
    meeple: number
    move: IMove
    weights: number[] // RED, GREEN, YELLOW, BLUE
    evaluated: boolean
}

function calcMove(_wgs :IWeightedState, depth :number) :IWeightedState {
    let wgs = deepClone(_wgs)

    // if game is no longer on, that means that the previous move rendered
    // a victory. Boost victors weights accordingly.
    if (!isGameStillOn(wgs.gameState)) {
        wgs.weights[wgs.gameState.whoseTurn] += WEIGHT_BOOST_VICTORY
        return wgs
    }

    // if depth is 0, then no further calculations should be made
    if (depth <= 0) return wgs

    // get current players meeples
    const meeples = wgs.gameState.meeples.reduce((meeples, meeple, i) => {
        if (meeple.player === wgs.gameState.whoseTurn)
            meeples.push(i)
        return meeples
    }, <number[]>[])

    // get moves of these meeples and weight them
    let moves = meeples.reduce((result, meeple) => {
        let moves = nextMoves(meeple, wgs.gameState.meeples, wgs.gameState.limits, BOARD)
        let tmp = moves.map(move => {
            return <IMeepleMove>{
                meeple: meeple,
                move: move,
                weights: calcWeights(move, meeple, wgs),
                evaluated: false
            }
        })
        return result.concat(tmp)
    }, <IMeepleMove[]>[])

    while(true) {
        moves = moves.sort((a,b) => {
            return calcWeightTotal(wgs.gameState.whoseTurn, b.weights)
                -  calcWeightTotal(wgs.gameState.whoseTurn, a.weights)
                || Math.random() - .5
        })
        if (moves[0].evaluated)
            break;

        let tmpGS = makeMove(moves[0].move, moves[0].meeple, wgs.gameState)
        let recursion = calcMove({gameState: tmpGS, weights: moves[0].weights}, --depth)
        moves[0].weights = recursion.weights
        moves[0].evaluated = true
    }
    
    let position = {row: moves[0].move.row, col: moves[0].move.col}
    return {
        gameState: makeMove(position, moves[0].meeple, wgs.gameState),
        weights: moves[0].weights
    }
}

function calcWeights(move :IMove, meeple :number, wgs :IWeightedState) :number[]
{
    let result = deepClone(wgs.weights)
    const thisPlayer = wgs.gameState.whoseTurn

    // if this move is a beating move, boost these players weights by 100
    if (move.moveType === EMoveType.BEATING)
        result[thisPlayer] += WEIGHT_BOOST_BEATING

    // check what role meeple on its new field has, boost weights accordingly
    let newlyPositionedMeeple = deepClone(wgs.gameState.meeples[meeple])
    newlyPositionedMeeple.position = move
    switch (getCurrentRole(newlyPositionedMeeple, BOARD)) {
        case ERoles.KNIGHT:
            result[thisPlayer] += WEIGHT_BOOST_KNIGHT
            break
        case ERoles.QUEEN:
            result[thisPlayer] += WEIGHT_BOOST_QUEEN
            break
        case ERoles.BISHOP:
            result[thisPlayer] += WEIGHT_BOOST_BISHOP
            break
        case ERoles.ROOK:
            result[thisPlayer] += WEIGHT_BOOST_ROOK
            break
    }

    return result
}

function calcWeightTotal(whose :EColors, weights :number[]) :number {
    return weights.reduce((result, _, i) => {
        return result + weights[i] * (whose === i ? 1 : -1)
    })
}