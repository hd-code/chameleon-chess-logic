import { EColor, isColor } from "./Color";
import { ILimits, isLimits, calcLimits, getStartingLimits, isPositionWithinLimits } from "./Limits";
import { IPawn, isPawn, getNextMoves, getIndexOfPawnAtPosition, getDefaultPawnsForPlayer } from "./Pawns";
import { IPosition, isPositionInPositions } from "./Position";

import { isArrayOf, deepClone, flattenArray } from "../helper";

// -----------------------------------------------------------------------------

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
}

export function isValidGameState(gs: IGameState): boolean {
    return areAllPawnsWithinLimits(gs.pawns, gs.limits)
        && !areTherePawnsOnTheSameField(gs.pawns)
        && isPlayerAlive(gs.whoseTurn, gs.pawns)
}

export function isPlayerAlive(player: EColor, pawns: IPawn[]): boolean {
    const playerPawns = pawns.filter(pawn => pawn.player === player)
    return playerPawns.length > 0
}

export function isGameOver(pawns: IPawn[]): boolean {
    const players = [EColor.RED, EColor.GREEN, EColor.YELLOW, EColor.BLUE]
    const playersAlive = players.filter(player => isPlayerAlive(player, pawns))
    return playersAlive.length < 2
}

export function initGameState(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns = <IPawn[]>[]
    red    && pawns.push(...getDefaultPawnsForPlayer(EColor.RED))
    green  && pawns.push(...getDefaultPawnsForPlayer(EColor.GREEN))
    yellow && pawns.push(...getDefaultPawnsForPlayer(EColor.YELLOW))
    blue   && pawns.push(...getDefaultPawnsForPlayer(EColor.BLUE))

    return {
        limits: getStartingLimits(),
        pawns: pawns,
        whoseTurn: getNextPlayer(EColor.GREEN, pawns) // usually RED begins
    }
}

export function isValidMove(gs: IGameState, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(gs.pawns)
        && gs.pawns[pawnI] && gs.pawns[pawnI].player === gs.whoseTurn
        && isPositionInPositions(destination, getNextMoves(pawnI, gs.pawns, gs.limits));
}

// TODO: handle special case with knight in the middle
/** Just makes the move. No validity check! Use isValidMove() to check validity */
export function makeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState {
    const beatenPawnIndex = getIndexOfPawnAtPosition(destination, gs.pawns);

    let pawns = deepClone(gs.pawns);
    pawns[pawnI].position = destination;
    pawns = pawns.filter((_,i) => i !== beatenPawnIndex);

    return {
        limits: calcLimits(pawns, gs.limits),
        pawns: pawns,
        whoseTurn: getNextPlayer(gs.whoseTurn, pawns)
    };
}

export function getNextPossibleGameStates(gs: IGameState): IGameState[] {
    const pawns = gs.pawns.filter(pawn => pawn.player === gs.whoseTurn)

    const GSs = pawns.map(pawn => {
        const pawnI = getIndexOfPawnAtPosition(pawn.position, gs.pawns)
        const moves = getNextMoves(pawnI, gs.pawns, gs.limits)
        return moves.map(move => makeMove(gs, pawnI, move))
    })

    return flattenArray(GSs)
}

// -----------------------------------------------------------------------------

function areAllPawnsWithinLimits(pawns: IPawn[], limits: ILimits): boolean {
    const pawnsWithinLimits = pawns.filter(pawn => isPositionWithinLimits(pawn.position, limits));
    return pawnsWithinLimits.length === pawns.length;
}

// TODO: check if sort is pure
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

function getNextPlayer(currentPlayer: EColor, pawns: IPawn[]): EColor {
    let nextPlayer = TURN_ORDER[currentPlayer];

    while (!isPlayerAlive(nextPlayer, pawns)) {
        nextPlayer = TURN_ORDER[nextPlayer];
    }

    return nextPlayer
}