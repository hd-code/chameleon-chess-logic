import { EColor, isColor } from "./Color";
import * as Limits from "./Limits";
import * as Pawns from "./Pawns";
import { IPosition, isPositionInPositions } from "./Position";

import { isKeyOfObject, isArray, deepClone, flattenArray } from "../../lib/hd-helper";

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
    let numOfPawnsPerPlayer = Pawns.getNumOfPawnsPerPlayer(gs.pawns);
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

export function createGameState(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState {
    let pawns = <Pawns.IPawn[]>[];

    red    && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.RED));
    green  && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.GREEN));
    yellow && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.YELLOW));
    blue   && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.BLUE));

    const limits = Limits.calcLimits(pawns, Limits.getStartingLimits());

    // GREEN comes before RED and RED usually starts
    return updateWhoseTurn({limits, pawns, whoseTurn: EColor.GREEN});
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

    const limits = Limits.calcLimits(pawns, gs.limits);

    const pawnInDeadlock = Pawns.getIndexOfPawnInDeadlock(pawns, limits);
    if (pawnInDeadlock !== -1 && !isGameOver({limits, pawns, whoseTurn: gs.whoseTurn}))
        pawns = pawns.filter((_,i) => i !== pawnInDeadlock);

    return updateWhoseTurn({limits, pawns, whoseTurn: gs.whoseTurn});
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

/** param is game state with everything updated except whoseTurn */
function updateWhoseTurn(tmpGS: IGameState): IGameState {
    let nextPlayer = TURN_ORDER[tmpGS.whoseTurn];
    const playersAliveState = arePlayersAlive(tmpGS);

    while (!playersAliveState[nextPlayer] && nextPlayer !== tmpGS.whoseTurn) {
        nextPlayer = TURN_ORDER[nextPlayer];
    }

    tmpGS.whoseTurn = nextPlayer;
    return tmpGS;
}