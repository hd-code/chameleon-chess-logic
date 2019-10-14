import { GameState, Position, getBoard, Color, Meeple } from "./main";
import { isArrayOf, deepClone } from "./helper";
import { isColor, isInPositions } from "./helperAdv";
import { isLimits, calcLimits, STARTING_LIMITS } from "./limits";
import { isMeeple, nextMoves, getIOfMeepleAtPosition, getDefaultMeeplesForPlayer } from "./meeples";

/* --------------------------------- Public --------------------------------- */

export function isGameState(gs :GameState) :gs is GameState {
    return 'limits'    in gs && isLimits(gs.limits)
        && 'meeples'   in gs && isArrayOf(gs.meeples, isMeeple)
        && 'whoseTurn' in gs && isColor(gs.whoseTurn)
}

export function init(players: {[player in Color]: boolean}): GameState {
    let meeples :Meeple[] = []
    players[Color.RED] && meeples.push(...getDefaultMeeplesForPlayer(Color.RED))
    players[Color.GREEN] && meeples.push(...getDefaultMeeplesForPlayer(Color.GREEN))
    players[Color.YELLOW] && meeples.push(...getDefaultMeeplesForPlayer(Color.YELLOW))
    players[Color.BLUE] && meeples.push(...getDefaultMeeplesForPlayer(Color.BLUE))

    return {
        limits: calcLimits(meeples, STARTING_LIMITS),
        meeples: meeples,
        whoseTurn: nextPlayer(Color.GREEN, meeples)
    }
}

/** Checks validity of the move, then makes the move. */
export function checkAndMakeMove(gs: GameState, meeple: number, destination: Position): GameState|null {
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
export function makeMove(gs: GameState, meeple: number, destination: Position): GameState {
    let result :GameState = deepClone(gs)

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

export function isGameOn(gs: GameState): boolean {
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
const TURN_ORDER :{[player in Color]: Color} = {
    [Color.RED]:    Color.BLUE,
    [Color.GREEN]:  Color.RED,
    [Color.YELLOW]: Color.GREEN,
    [Color.BLUE]:   Color.YELLOW
}
function nextPlayer(currentPlayer: Color, meeples: Meeple[]): Color {
    let nextPlayer: Color = currentPlayer

    do { nextPlayer = TURN_ORDER[nextPlayer] }
    while(nextPlayer !== currentPlayer && !isPlayerAlive(nextPlayer, meeples))

    return nextPlayer
}

function isPlayerAlive(player :Color, allMeeples :Meeple[]) :boolean {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (allMeeples[i].player === player)
            return true
    }
    return false
}