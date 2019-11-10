import { isArrayOf, deepClone, flattenArray } from "./helper";
import { EColor, isColor, getBoard, IPosition, isInPositions, ERole } from "./basic";
import { ILimits, isLimits, calcLimits, getStartingLimits, isWithinLimits, isSmallestFieldSize } from "./limits";
import { IPawn, isPawn, getNextMoves, getIOfPawnAtPosition, getDefaultPawnsForPlayer, getIOfPawn, getCurrentRole } from "./pawns";

/* --------------------------------- Public --------------------------------- */

export interface IGameState {
    limits: ILimits
    pawns: IPawn[]
    whoseTurn: EColor
}

export function isGameState(gs: IGameState): gs is IGameState {
    // check for all keys and check type of value
    return 'limits'    in gs && isLimits(gs.limits)
        && 'pawns'     in gs && isArrayOf(gs.pawns, isPawn)
        && 'whoseTurn' in gs && isColor(gs.whoseTurn)

        // check that there are no pawns outside of the limits
        && 0 === gs.pawns.filter(pawn => !isWithinLimits(pawn.position, gs.limits)).length

        // check that no pawns are on the same field
        && !areTherePawnsOnTheSameField(gs.pawns)

        // check if current player is even alive
        && isPlayerAlive(gs.whoseTurn, gs.pawns)
}

export function isPlayerAlive(player: EColor, pawns: IPawn[]): boolean {
    const playerPawns = pawns.filter(pawn => pawn.player === player)
    return playerPawns.length > 0
}

export function init(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns = <IPawn[]>[]
    red    && pawns.push(...getDefaultPawnsForPlayer(EColor.RED))
    green  && pawns.push(...getDefaultPawnsForPlayer(EColor.GREEN))
    yellow && pawns.push(...getDefaultPawnsForPlayer(EColor.YELLOW))
    blue   && pawns.push(...getDefaultPawnsForPlayer(EColor.BLUE))

    return {
        limits: calcLimits(pawns, getStartingLimits()),
        pawns: pawns,
        whoseTurn: nextPlayer(EColor.GREEN, pawns) // usually RED begins
    }
}

/** Checks validity of the move, then makes the move. */
export function checkAndMakeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState|null {
    // check if game is still on
    if (isGameOver(gs.pawns))
        return null

    // check if the pawn exists and if it is of current players color
    if (!gs.pawns[pawnI] || gs.pawns[pawnI].player !== gs.whoseTurn)
        return null

    // calc possible moves and check if the destination is part of them
    let possibleMoves = getNextMoves(pawnI, gs.pawns, gs.limits, getBoard())
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
    const pawnOnField = getIOfPawnAtPosition(destination, gs.pawns)
    result.pawns = result.pawns.filter((_,i) => i !== pawnOnField)

    // update limits
    result.limits = calcLimits(result.pawns, gs.limits)

    // handle the special case, when the board has shrunken to its smallest size
    // if there is a pawn in the middle who happens to be a knight, it can't
    // move anywhere and is therefore removed from the board altogether!
    if (isSmallestFieldSize(result.limits)) {
        const centralField = <IPosition>{
            row: result.limits.lower.row + 1,
            col: result.limits.lower.col + 1
        }
        const pawnOnField = getIOfPawnAtPosition(centralField, result.pawns)
        if (pawnOnField !== -1 &&
            getCurrentRole(result.pawns[pawnOnField], getBoard()) === ERole.KNIGHT)
                result.pawns = result.pawns.filter((_,i) => i !== pawnOnField)
    }

    // set next players turn
    result.whoseTurn = nextPlayer(gs.whoseTurn, result.pawns)

    return result
}

export function isGameOver(pawns: IPawn[]): boolean {
    const players = [EColor.RED, EColor.GREEN, EColor.YELLOW, EColor.BLUE]
    const playersAlive = players.filter(player => isPlayerAlive(player, pawns))
    return playersAlive.length < 2
}

export function getNextPossibleGameStates(gs: IGameState): IGameState[] {
    const pawns = gs.pawns.filter(pawn => pawn.player === gs.whoseTurn)

    const GSs = pawns.map(pawn => {
        const pawnI = getIOfPawn(pawn, gs.pawns)
        const moves = getNextMoves(pawnI, gs.pawns, gs.limits, getBoard())
        return moves.map(move => makeMove(gs, pawnI, move))
    })

    return flattenArray(GSs)
}

/* --------------------------------- Intern --------------------------------- */

function areTherePawnsOnTheSameField(pawns: IPawn[]): boolean {
    const orderedPawns = pawns.sort((a,b) => a.position.row - b.position.row)
    for (let i = 1, ie = orderedPawns.length; i < ie; i++) {
        if (   orderedPawns[i-1].position.row === orderedPawns[i].position.row
            && orderedPawns[i-1].position.col === orderedPawns[i].position.col)
                return true
    }
    return false
}

// usage: TURN_ORDER[ currentPlayer ] -> nextPlayer
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