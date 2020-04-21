import { EColor, isColor } from './Color';
import * as Limits from './Limits';
import * as Pawns from './Pawns';
import { IPosition, isPositionInPositions } from './Position';

import { isKeyOfObject, isArray, deepClone, flattenArray } from '../../lib/hd-helper';

// -----------------------------------------------------------------------------

/**
 * Represents the current situation on the game board. This is the state between
 * player turns.
 */
export interface IGame {
    /**
     * The current limits of the board. Specify which of the fields on the board
     * are still reachable and wich are out of bounds.
     */
    limits: Limits.ILimits;
    /**
     * An array containing all pawns that are still in game and thus on the
     * board.
     */
    pawns: Pawns.IPawn[];
    /** The color of the player, who is currently on turn. */
    whoseTurn: EColor;
}

export function isGame(game: any): game is IGame {
    return isKeyOfObject(game, 'limits', Limits.isLimits)
        && isKeyOfObject(game, 'pawns') && isArray(game.pawns, Pawns.isPawn)
        && isKeyOfObject(game, 'whoseTurn', isColor)
        && Pawns.areAllPawnsWithinLimits(game.pawns, game.limits)
        && !Pawns.areTherePawnsOnTheSameField(game.pawns)
        && arePlayersAlive(game)[(game.whoseTurn as EColor)];
}

export function arePlayersAlive(game: IGame): {[player in EColor]: boolean} {
    let numOfPawnsPerPlayer = Pawns.getNumOfPawnsPerPlayer(game.pawns);
    return {
        [EColor.RED]:    numOfPawnsPerPlayer[EColor.RED]    > 0,
        [EColor.GREEN]:  numOfPawnsPerPlayer[EColor.GREEN]  > 0,
        [EColor.YELLOW]: numOfPawnsPerPlayer[EColor.YELLOW] > 0,
        [EColor.BLUE]:   numOfPawnsPerPlayer[EColor.BLUE]   > 0
    };
}

export function isGameOver(game: IGame): boolean {
    let numOfPlayers = 0;
    const playersAlive = arePlayersAlive(game);
    for (const player in playersAlive) {
        if (playersAlive[(parseInt(player) as EColor)]) numOfPlayers++;
    }
    return numOfPlayers < 2;
}

export function createGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGame {
    let pawns = <Pawns.IPawn[]>[];

    red    && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.RED));
    green  && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.GREEN));
    yellow && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.YELLOW));
    blue   && pawns.push(...Pawns.getDefaultPawnsForPlayer(EColor.BLUE));

    const limits = Limits.calcLimits(pawns, Limits.getStartingLimits());

    // GREEN comes before RED and RED usually starts
    return updateWhoseTurn({limits, pawns, whoseTurn: EColor.GREEN});
}

export function isValidMove(game: IGame, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(game)
        && game.pawns[pawnI] && game.pawns[pawnI].player === game.whoseTurn
        && isPositionInPositions(destination, Pawns.getNextMoves(pawnI, game.pawns, game.limits));
}

/** Just makes the move. No validity check! Use isValidMove() to check validity */
export function makeMove(game: IGame, pawnI: number, destination: IPosition): IGame {
    const beatenPawnIndex = Pawns.getIndexOfPawnAtPosition(destination, game.pawns);

    let pawns = deepClone(game.pawns);
    pawns[pawnI].position = destination;
    pawns = pawns.filter((_,i) => i !== beatenPawnIndex);

    const limits = Limits.calcLimits(pawns, game.limits);

    const pawnInDeadlock = Pawns.getIndexOfPawnInDeadlock(pawns, limits);
    if (pawnInDeadlock !== -1 && !isGameOver({limits, pawns, whoseTurn: game.whoseTurn}))
        pawns = pawns.filter((_,i) => i !== pawnInDeadlock);

    return updateWhoseTurn({limits, pawns, whoseTurn: game.whoseTurn});
}

export function getNextPossibleGames(game: IGame): IGame[] {
    const pawns = game.pawns.filter(pawn => pawn.player === game.whoseTurn);

    const GSs = pawns.map(pawn => {
        const pawnI = Pawns.getIndexOfPawnAtPosition(pawn.position, game.pawns);
        const moves = Pawns.getNextMoves(pawnI, game.pawns, game.limits);
        return moves.map(move => makeMove(game, pawnI, move));
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

/** param is game with everything updated except whoseTurn */
function updateWhoseTurn(tmpGame: IGame): IGame {
    let nextPlayer = TURN_ORDER[tmpGame.whoseTurn];
    const playersAliveState = arePlayersAlive(tmpGame);

    while (!playersAliveState[nextPlayer] && nextPlayer !== tmpGame.whoseTurn) {
        nextPlayer = TURN_ORDER[nextPlayer];
    }

    tmpGame.whoseTurn = nextPlayer;
    return tmpGame;
}