import { IMeeple, nextMoves, findMeepleAtPosition } from "./meeples"
import { ILimits, calcLimits } from "./limits"
import { EColors, IPosition, BOARD, isWithinMoves } from "./basic"

/*********************************** Public ***********************************/

export interface IGameState {
    limits: ILimits
    meeples: IMeeple[]
    whoseTurn: EColors
}

export function advanceGame(move :IPosition, meeple :number, gs :IGameState)
    :IGameState|null
{
    // check if game is still on
    if (!isGameStillOn(gs))
        return null

    // check if selectedMeeple exists and if it is of current players color
    if (!gs.meeples[meeple] || gs.meeples[meeple].player !== gs.whoseTurn)
        return null

    // calc possible moves and check if move is part of them
    let possibleMoves = nextMoves(meeple, gs.meeples, gs.limits, BOARD)
    if (!isWithinMoves(move, possibleMoves))
        return null

    // now create next gameState by copying the old one
    let result :IGameState = JSON.parse(JSON.stringify(gs))

    // move meeple
    result.meeples[meeple].position = move

    // if an opponents meeple is beaten, remove it
    let meepleOnField = findMeepleAtPosition(move, gs.meeples)
    result.meeples = gs.meeples.filter(meeple => meeple !== meepleOnField)

    // update limits
    result.limits = calcLimits(result.meeples, gs.limits)

    // set next players turn
    result.whoseTurn = nextPlayer(gs.whoseTurn, result.meeples)

    return result
}

export function isGameStillOn(gs :IGameState) :boolean {
    let players :any = {}

    gs.meeples.forEach(meeple => {
        if (!players[meeple.player])
            players[meeple.player] = true
    })

    return players.length >= 2 && players[gs.whoseTurn]
}

/*********************************** Intern ***********************************/

// usage: TURN_ORDER[ currentPlayerColor ]
//      -> nextPlayerColor
const TURN_ORDER = [
    // RED:
    EColors.BLUE,
    // GREEN:
    EColors.RED,
    // YELLOW:
    EColors.GREEN,
    // BLUE:
    EColors.YELLOW
]
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