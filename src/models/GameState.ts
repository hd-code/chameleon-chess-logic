import { EColor, isColor } from "./Color";
import { ILimits, isLimits, calcLimits, getStartingLimits } from "./Limits";
import * as Pawns from "./Pawns";
import { IPosition, isPositionInPositions } from "./Position";

import { isKeyOfObject, isArray, deepClone, flattenArray } from "../lib/hd-helper";

// -----------------------------------------------------------------------------

export interface IGameState {
    limits: ILimits;
    pawns: Pawns.IPawn[];
    whoseTurn: EColor;
}

export function isGameState(gs: any): gs is IGameState {
    return isKeyOfObject(gs, 'limits', isLimits)
        && isKeyOfObject(gs, 'pawns') && isArray(gs.pawns, Pawns.isPawn)
        && isKeyOfObject(gs, 'whoseTurn', isColor)
        && Pawns.areAllPawnsWithinLimits(gs.pawns, gs.limits)
        && !Pawns.areTherePawnsOnTheSameField(gs.pawns)
        && isPlayerAlive(gs, gs.whoseTurn);
}

export function isGameOver(gs: IGameState): boolean {
    const players = [EColor.RED, EColor.GREEN, EColor.YELLOW, EColor.BLUE];
    const playersAlive = players.filter(player => isPlayerAlive(gs, player));
    return playersAlive.length < 2;
}

export function isPlayerAlive(gs: IGameState, player: EColor): boolean {
    const playerPawns = gs.pawns.filter(pawn => pawn.player === player);
    if (playerPawns.length === 0)
        return false;

    const pawnIs = playerPawns.map(pawn => Pawns.getIndexOfPawn(pawn, gs.pawns));
    const moves = pawnIs.map(pawnI => Pawns.getNextMoves(pawnI, gs.pawns, gs.limits));

    return flattenArray(moves).length > 0;
}

export function isValidMove(gs: IGameState, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(gs)
        && gs.pawns[pawnI] && gs.pawns[pawnI].player === gs.whoseTurn
        && isPositionInPositions(destination, Pawns.getNextMoves(pawnI, gs.pawns, gs.limits));
}

export function initGameState(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns = <Pawns.IPawn[]>[];

    red    && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.RED));
    green  && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.GREEN));
    yellow && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.YELLOW));
    blue   && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.BLUE));

    let result = {
        limits: getStartingLimits(),
        pawns: pawns,
        whoseTurn: EColor.GREEN // usually RED begins, GREEN is just before RED
    };
    result.whoseTurn = getNextPlayer(result);

    return result;
}

/** Just makes the move. No validity check! Use isValidMove() to check validity */
export function makeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState {
    const beatenPawnIndex = Pawns.getIndexOfPawnAtPosition(destination, gs.pawns);

    let pawns = deepClone(gs.pawns);
    pawns[pawnI].position = destination;
    pawns = pawns.filter((_,i) => i !== beatenPawnIndex);

    return {
        limits: calcLimits(pawns, gs.limits),
        pawns: pawns,
        whoseTurn: getNextPlayer(gs)
    };
}

export function getNextPossibleGameStates(gs: IGameState): IGameState[] {
    const pawns = gs.pawns.filter(pawn => pawn.player === gs.whoseTurn);

    const GSs = pawns.map(pawn => {
        const pawnI = Pawns.getIndexOfPawnAtPosition(pawn.position, gs.pawns);
        const moves = Pawns.getNextMoves(pawnI, gs.pawns, gs.limits);
        return moves.map(move => makeMove(gs, pawnI, move));
    });

    return flattenArray(GSs);
}

// -----------------------------------------------------------------------------

// usage: TURN_ORDER[ currentPlayer ] -> nextPlayer
const TURN_ORDER: {[player in EColor]: EColor} = {
    [EColor.RED]:    EColor.BLUE,
    [EColor.GREEN]:  EColor.RED,
    [EColor.YELLOW]: EColor.GREEN,
    [EColor.BLUE]:   EColor.YELLOW
};

function getNextPlayer(gs: IGameState): EColor {
    let nextPlayer = TURN_ORDER[gs.whoseTurn];

    while (!isPlayerAlive(gs, nextPlayer)) {
        nextPlayer = TURN_ORDER[nextPlayer];
    }

    return nextPlayer;
}