import { deepClone, isArrayOf } from "./helper";
import { BOARD, EColors, IPosition, isInPositions, isColor } from "./basic"
import { ILimits, STARTING_LIMITS, calcLimits, isLimits } from "./limits"
import { IMeeple, isMeeple, getDefaultMeeplesForPlayer, nextMoves, getIOfMeepleAtPosition } from "./meeples"

/* --------------------------------- Public --------------------------------- */

export interface IGameState {
    limits: ILimits
    meeples: IMeeple[]
    whoseTurn: EColors
}

export function isGameState(gs :IGameState) :gs is IGameState {
    return 'limits'    in gs && isLimits(gs.limits)
        && 'meeples'   in gs && isArrayOf(gs.meeples, isMeeple)
        && 'whoseTurn' in gs && isColor(gs.whoseTurn)
}

export function init(numOfPlayers ?:number): IGameState {
    let meeples :IMeeple[] = []
    switch (numOfPlayers) {
        case 4: meeples.unshift(...getDefaultMeeplesForPlayer(EColors.BLUE))
        case 3: meeples.unshift(...getDefaultMeeplesForPlayer(EColors.GREEN))
        default:
            meeples.unshift(...getDefaultMeeplesForPlayer(EColors.YELLOW))
            meeples.unshift(...getDefaultMeeplesForPlayer(EColors.RED))
    }

    return {
        limits: STARTING_LIMITS,
        meeples: meeples,
        whoseTurn: EColors.RED
    }
}

/** Checks validity of the move, then makes the move. */
export function checkAndMakeMove(destination :IPosition, meeple :number, gs :IGameState)
    :IGameState|null
{
    // check if game is still on
    if (!isGameOn(gs))
        return null

    // check if selectedMeeple exists and if it is of current players color
    if (!gs.meeples[meeple] || gs.meeples[meeple].player !== gs.whoseTurn)
        return null

    // calc possible moves and check if move is part of them
    let possibleMoves = nextMoves(meeple, gs.meeples, gs.limits, BOARD)
    if (!isInPositions(destination, possibleMoves))
        return null

    return makeMove(destination, meeple, gs)
}

/** Just makes the move. No validity check! Handle with care! */
export function makeMove(destination :IPosition, meeple :number, gs :IGameState)
    :IGameState
{
    let result :IGameState = deepClone(gs)

    // move meeple
    result.meeples[meeple].position = destination

    // if an opponents meeple is beaten, remove it
    let meepleOnField = getIOfMeepleAtPosition(destination, gs.meeples)
    result.meeples = result.meeples.filter((_,i) => i !== meepleOnField)

    // update limits
    result.limits = calcLimits(result.meeples, gs.limits)

    // set next players turn
    result.whoseTurn = nextPlayer(gs.whoseTurn, result.meeples)

    return result
}

export function isGameOn(gs :IGameState) :boolean {
    let players :{[player: number]:boolean} = {}

    gs.meeples.forEach(meeple => {
        if (!players[meeple.player])
            players[meeple.player] = true
    })

    return Object.keys(players).length >= 2 && players[gs.whoseTurn]
}

/* --------------------------------- Intern --------------------------------- */

// usage: TURN_ORDER[ currentPlayerColor ]
//      -> nextPlayerColor
const TURN_ORDER :{[player in EColors]: EColors} = {
    [EColors.RED]: EColors.BLUE,
    [EColors.GREEN]: EColors.RED,
    [EColors.YELLOW]: EColors.GREEN,
    [EColors.BLUE]: EColors.YELLOW
}
function nextPlayer(currentPlayer :EColors, meeples :IMeeple[]) :EColors {
    let nextPlayer :EColors = currentPlayer

    do { nextPlayer = TURN_ORDER[nextPlayer] }
    while(nextPlayer !== currentPlayer && !isPlayerAlive(nextPlayer, meeples))

    return nextPlayer
}

function isPlayerAlive(player :EColors, allMeeples :IMeeple[]) :boolean {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (allMeeples[i].player === player)
            return true
    }
    return false
}