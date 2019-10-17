import { IGameState, IPosition, getBoard, EColor, IMeeple } from "./main";
import { isArrayOf, deepClone } from "./helper";
import { isColor, isInPositions } from "./helperAdv";
import { isLimits, calcLimits, STARTING_LIMITS } from "./limits";
import { isMeeple, nextMoves, getIOfMeepleAtPosition, getDefaultMeeplesForPlayer } from "./meeples";

/* --------------------------------- Public --------------------------------- */

export function isGameState(gs :IGameState) :gs is IGameState {
    return 'limits'    in gs && isLimits(gs.limits)
        && 'meeples'   in gs && isArrayOf(gs.meeples, isMeeple)
        && 'whoseTurn' in gs && isColor(gs.whoseTurn)
}

export function init(players: {[player in EColor]: boolean}): IGameState {
    let meeples :IMeeple[] = []
    players[EColor.RED] && meeples.push(...getDefaultMeeplesForPlayer(EColor.RED))
    players[EColor.GREEN] && meeples.push(...getDefaultMeeplesForPlayer(EColor.GREEN))
    players[EColor.YELLOW] && meeples.push(...getDefaultMeeplesForPlayer(EColor.YELLOW))
    players[EColor.BLUE] && meeples.push(...getDefaultMeeplesForPlayer(EColor.BLUE))

    return {
        limits: calcLimits(meeples, STARTING_LIMITS),
        meeples: meeples,
        whoseTurn: nextPlayer(EColor.GREEN, meeples)
    }
}

/** Checks validity of the move, then makes the move. */
export function checkAndMakeMove(gs: IGameState, meeple: number, destination: IPosition): IGameState|null {
    // check if game is still on
    if (!isGameOn(gs))
        return null

    // check if selectedMeeple exists and if it is of current players color
    if (!gs.meeples[meeple] || gs.meeples[meeple].player !== gs.whoseTurn)
        return null

    // calc possible moves and check if move is part of them
    let possibleMoves = nextMoves(meeple, gs.meeples, gs.limits, getBoard())
    if (!isInPositions(destination, possibleMoves))
        return null

    return makeMove(gs, meeple, destination)
}

/** Just makes the move. No validity check! Handle with care! */
export function makeMove(gs: IGameState, meeple: number, destination: IPosition): IGameState {
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

export function isGameOn(gs: IGameState): boolean {
    let players: {[player: number]:boolean} = {}

    gs.meeples.forEach(meeple => {
        if (!players[meeple.player])
            players[meeple.player] = true
    })

    return Object.keys(players).length >= 2 && players[gs.whoseTurn]
}

/* --------------------------------- Intern --------------------------------- */

// usage: TURN_ORDER[ currentPlayerColor ]
//      -> nextPlayerColor
const TURN_ORDER :{[player in EColor]: EColor} = {
    [EColor.RED]:    EColor.BLUE,
    [EColor.GREEN]:  EColor.RED,
    [EColor.YELLOW]: EColor.GREEN,
    [EColor.BLUE]:   EColor.YELLOW
}
function nextPlayer(currentPlayer: EColor, meeples: IMeeple[]): EColor {
    let nextPlayer: EColor = currentPlayer

    do { nextPlayer = TURN_ORDER[nextPlayer] }
    while(nextPlayer !== currentPlayer && !isPlayerAlive(nextPlayer, meeples))

    return nextPlayer
}

function isPlayerAlive(player :EColor, allMeeples :IMeeple[]) :boolean {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (allMeeples[i].player === player)
            return true
    }
    return false
}