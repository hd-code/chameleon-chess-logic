import { isArrayOf, deepClone, flattenArray } from "./helper";
import { EColor, isColor, BOARD, IPosition, isInPositions } from "./basic";
import { ILimits, isLimits, calcLimits, STARTING_LIMITS } from "./limits";
import { IPawn, isPawn, nextMoves, getIOfPawnAtPosition, getDefaultPawnsForPlayer, getIOfPawn } from "./pawns";

/* --------------------------------- Public --------------------------------- */

export interface IGameState {
    limits: ILimits
    pawns: IPawn[]
    whoseTurn: EColor
}

export function isGameState(gs: IGameState): gs is IGameState {
    return 'limits'    in gs && isLimits(gs.limits)
        && 'pawns'     in gs && isArrayOf(gs.pawns, isPawn)
        && 'whoseTurn' in gs && isColor(gs.whoseTurn)
}

export type TPlayerConfig = {[player in EColor]: boolean}

export function init(players: TPlayerConfig): IGameState {
    let pawns = <IPawn[]>[]
    players[EColor.RED] && pawns.push(...getDefaultPawnsForPlayer(EColor.RED))
    players[EColor.GREEN] && pawns.push(...getDefaultPawnsForPlayer(EColor.GREEN))
    players[EColor.YELLOW] && pawns.push(...getDefaultPawnsForPlayer(EColor.YELLOW))
    players[EColor.BLUE] && pawns.push(...getDefaultPawnsForPlayer(EColor.BLUE))

    return {
        limits: calcLimits(pawns, STARTING_LIMITS),
        pawns: pawns,
        whoseTurn: nextPlayer(EColor.GREEN, pawns)
    }
}

/** Checks validity of the move, then makes the move. */
export function checkAndMakeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState|null {
    // check if game is still on
    if (!isGameOn(gs))
        return null

    // check if the pawn exists and if it is of current players color
    if (!gs.pawns[pawnI] || gs.pawns[pawnI].player !== gs.whoseTurn)
        return null

    // calc possible moves and check if the destination is part of them
    let possibleMoves = nextMoves(pawnI, gs.pawns, gs.limits, BOARD)
    if (!isInPositions(destination, possibleMoves))
        return null

    return makeMove(gs, pawnI, destination)
}

/** Just makes the move. No validity check! Handle with care! */
export function makeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState {
    let result :IGameState = deepClone(gs)

    // move pawn
    result.pawns[pawnI].position = destination

    // if an opponents pawn is beaten, remove it
    let pawnOnField = getIOfPawnAtPosition(destination, gs.pawns)
    result.pawns = result.pawns.filter((_,i) => i !== pawnOnField)

    // update limits
    result.limits = calcLimits(result.pawns, gs.limits)

    // set next players turn
    result.whoseTurn = nextPlayer(gs.whoseTurn, result.pawns)

    return result
}

export function isGameOn(gs: IGameState): boolean {
    let players: {[player: number]:boolean} = {}

    gs.pawns.forEach(pawn => {
        if (!players[pawn.player])
            players[pawn.player] = true
    })

    return Object.keys(players).length >= 2 && players[gs.whoseTurn]
}

export function getNextPossibleGameStates(gs: IGameState): IGameState[] {
    const pawns = gs.pawns.filter(pawn => pawn.player === gs.whoseTurn)

    const resultArr = pawns.map(pawn => {
        const pawnI = getIOfPawn(pawn, gs.pawns)
        const moves = nextMoves(pawnI, gs.pawns, gs.limits, BOARD)
        return moves.map(move => makeMove(gs, pawnI, move))
    })

    return flattenArray(resultArr)
}

/* --------------------------------- Intern --------------------------------- */

// usage: TURN_ORDER[ currentPlayerColor ]
//      -> nextPlayerColor
const TURN_ORDER: {[player in EColor]: EColor} = {
    [EColor.RED]:    EColor.BLUE,
    [EColor.GREEN]:  EColor.RED,
    [EColor.YELLOW]: EColor.GREEN,
    [EColor.BLUE]:   EColor.YELLOW
}
function nextPlayer(currentPlayer: EColor, pawns: IPawn[]): EColor {
    let nextPlayer: EColor = currentPlayer

    do { nextPlayer = TURN_ORDER[nextPlayer] }
    while(nextPlayer !== currentPlayer && !isPlayerAlive(nextPlayer, pawns))

    return nextPlayer
}

function isPlayerAlive(player: EColor, pawns: IPawn[]): boolean {
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        if (pawns[i].player === player)
            return true
    }
    return false
}