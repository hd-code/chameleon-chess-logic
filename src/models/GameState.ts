import { EColor, isColor } from "./Color";
import * as Limits from "./Limits";
import * as Pawns from "./Pawns";
import { IPosition, isPositionInPositions } from "./Position";

import { isKeyOfObject, isArray, deepClone, flattenArray } from "../lib/hd-helper";

// -----------------------------------------------------------------------------

export interface IGameState {
    limits: Limits.ILimits;
    pawns: Pawns.IPawn[];
    whoseTurn: EColor;
}

export function isGameState(gs: any): gs is IGameState {
    return isKeyOfObject(gs, 'limits', Limits.isLimits)
        && isKeyOfObject(gs, 'pawns') && isArray(gs.pawns, Pawns.isPawn)
        && isKeyOfObject(gs, 'whoseTurn', isColor)
        && Pawns.areAllPawnsWithinLimits(gs.pawns, gs.limits)
        && !Pawns.areTherePawnsOnTheSameField(gs.pawns)
        && arePlayersAlive(gs)[(gs.whoseTurn as EColor)];
}

export function arePlayersAlive(gs: IGameState): {[player in EColor]: boolean} {
    let numOfPawnsPerPlayer = getNumOfPawnsPerPlayer(gs);

    const playerInDeadlock = getPlayerInDeadlock(gs);
    if (playerInDeadlock !== null)
        numOfPawnsPerPlayer[playerInDeadlock]--;

    return {
        [EColor.RED]:    numOfPawnsPerPlayer[EColor.RED]    > 0,
        [EColor.GREEN]:  numOfPawnsPerPlayer[EColor.GREEN]  > 0,
        [EColor.YELLOW]: numOfPawnsPerPlayer[EColor.YELLOW] > 0,
        [EColor.BLUE]:   numOfPawnsPerPlayer[EColor.BLUE]   > 0
    };
}

export function isGameOver(gs: IGameState): boolean {
    let numOfPlayers = 0;
    const playersAlive = arePlayersAlive(gs);
    for (const player in playersAlive) {
        if (playersAlive[(parseInt(player) as EColor)]) numOfPlayers++;
    }
    return numOfPlayers < 2;
}

export function initGameState(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns = <Pawns.IPawn[]>[];

    red    && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.RED));
    green  && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.GREEN));
    yellow && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.YELLOW));
    blue   && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.BLUE));

    let result = {
        limits: Limits.getStartingLimits(),
        pawns: pawns,
        whoseTurn: EColor.GREEN // usually RED begins, GREEN is just before RED
    };
    result.limits = Limits.calcLimits(pawns, result.limits);
    result.whoseTurn = getNextPlayer(result);

    return result;
}

export function isValidMove(gs: IGameState, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(gs)
        && gs.pawns[pawnI] && gs.pawns[pawnI].player === gs.whoseTurn
        && isPositionInPositions(destination, Pawns.getNextMoves(pawnI, gs.pawns, gs.limits));
}

/** Just makes the move. No validity check! Use isValidMove() to check validity */
export function makeMove(gs: IGameState, pawnI: number, destination: IPosition): IGameState {
    const beatenPawnIndex = Pawns.getIndexOfPawnAtPosition(destination, gs.pawns);

    let pawns = deepClone(gs.pawns);
    pawns[pawnI].position = destination;
    pawns = pawns.filter((_,i) => i !== beatenPawnIndex);

    return {
        limits: Limits.calcLimits(pawns, gs.limits),
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

function getNumOfPawnsPerPlayer(gs: IGameState): {[player in EColor]: number} {
    let result = {
        [EColor.RED]: 0, [EColor.GREEN]: 0, [EColor.YELLOW]: 0, [EColor.BLUE]: 0
    };

    gs.pawns.forEach(pawn => result[pawn.player]++);

    return result;
}

function getPlayerInDeadlock(gs: IGameState): EColor|null {
    if (!Limits.isSmallestFieldSize(gs.limits))
        return null;
    
    const centerPos = {
        row: gs.limits.lower.row + 1,
        col: gs.limits.lower.col + 1
    };
    const pawnAtCenter = Pawns.getIndexOfPawnAtPosition(centerPos, gs.pawns);
    if (pawnAtCenter === -1)
        return null;;

    const moves = Pawns.getNextMoves(pawnAtCenter, gs.pawns, gs.limits);
    return moves.length === 0 ? gs.pawns[pawnAtCenter].player : null;
}

// usage: TURN_ORDER[ currentPlayer ] -> nextPlayer
const TURN_ORDER: {[player in EColor]: EColor} = {
    [EColor.RED]:    EColor.BLUE,
    [EColor.GREEN]:  EColor.RED,
    [EColor.YELLOW]: EColor.GREEN,
    [EColor.BLUE]:   EColor.YELLOW
};

function getNextPlayer(gs: IGameState): EColor {
    let nextPlayer = TURN_ORDER[gs.whoseTurn];
    const playersAliveState = arePlayersAlive(gs);

    while (!playersAliveState[nextPlayer]) {
        nextPlayer = TURN_ORDER[nextPlayer];
    }

    return nextPlayer;
}