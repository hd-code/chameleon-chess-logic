import { IGameState, IPawn, EPlayer, IPosition } from '../types';

import { isLimits, isWithinLimits, calcLimits, getStartLimits } from './limits';
import { isPawn, getStartPawns, getPawnsIAtPosition as getIndexOfP, getMoves as getM, getIndexOfPawnInDeadlock } from './pawn';
import { isPlayer, isPlayerAlive, getNextPlayer } from './player';
import { isInPositions, sortPositions, isSamePosition } from './position';

import { deepClone } from '../../lib/aux';
import { hasKey, isArray } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * Type guard for `IGameState`.
 * 
 * It checks all the keys and types of the object. It will also perform further
 * checks to confirm the validity of the game state, that go beyond simple type
 * checking.
 * 
 * E.g. if there are several pawns on the same field (which is not possible
 * according to the game rules), this function will return false, as well.
 */
export function isGameState(gs: any): gs is IGameState {
    return hasKey(gs, 'limits', isLimits)
        && hasKey(gs, 'pawns') && isArray(gs.pawns, isPawn)
        && hasKey(gs, 'player', isPlayer)
        && noPawnsOutsideOfLimits(gs)
        && noPawnsOnSameField(gs)
        && isPlayerAlive(gs.player, gs.pawns);
}

export function getStartGameState(players: {[player in EPlayer]: boolean}): IGameState {
    let pawns: IPawn[] = [];
    if (players[0]) pawns = pawns.concat(getStartPawns(EPlayer.RED));
    if (players[1]) pawns = pawns.concat(getStartPawns(EPlayer.GREEN));
    if (players[2]) pawns = pawns.concat(getStartPawns(EPlayer.YELLOW));
    if (players[3]) pawns = pawns.concat(getStartPawns(EPlayer.BLUE));

    if (pawns.length < 1) return { pawns, limits: getStartLimits(), player: EPlayer.RED };

    const limits = calcLimits(pawns, getStartLimits());
    const player = getNextPlayer(EPlayer.GREEN, pawns);
    return { pawns, limits, player };
}

export function isValidMove(gs: IGameState, pawnI: number, destination: IPosition): boolean {
    return !isGameOver(gs) // game is still on
        && gs.pawns[pawnI]?.player === gs.player // pawn belongs to player on turn
        && isInPositions(destination, getM(pawnI, gs.pawns, gs.limits));
}

/** Just makes the move. No validity check! Use isValidMove() to check validity first. */
export function updateGameState(gs: IGameState, pawnI: number, destination: IPosition): IGameState {
    const beatenPawnIndex = getIndexOfP(gs.pawns, destination);

    let pawns = deepClone(gs.pawns);
    pawns[pawnI].position = destination;
    if (beatenPawnIndex >= 0) pawns.splice(beatenPawnIndex, 1);

    const limits = calcLimits(pawns, gs.limits);

    const pawnIInDeadlock = getIndexOfPawnInDeadlock(pawns, limits);
    if (pawnIInDeadlock !== -1 && !isGameOver({limits, pawns, player: gs.player})) {
        pawns.splice(pawnIInDeadlock, 1);
    }

    const player = getNextPlayer(gs.player, pawns);

    return {limits, pawns, player};
}

export function isGameOver(gs: IGameState): boolean {
    const player = gs.pawns[0]?.player;
    for (let i = 1, ie = gs.pawns.length; i < ie; i++) {
        if (player !== gs.pawns[i].player) return false;
    }
    return true;
}

/**
 * This is for the AI. It returns all possible game states that could succeed
 * the current one. Ergo, it returns the resulting game states for all moves 
 * that can be made in the current game state. The AI now has to choose
 * intelligently, which game state to select to continue.
 */
export function getNextGameStates(gs: IGameState): IGameState[] {
    let result: IGameState[] = [];

    for (let i = 0, ie = gs.pawns.length; i < ie; i++) {
        if (gs.pawns[i].player !== gs.player) continue;

        const moves = getM(i, gs.pawns, gs.limits);
        const gameStates = moves.map(move => updateGameState(gs, i, move));
        result = result.concat(gameStates);
    }

    return result;
}

// -----------------------------------------------------------------------------

function noPawnsOutsideOfLimits({pawns, limits}: IGameState): boolean {
for (let i = 0, ie = pawns.length; i < ie; i++) {
        if (!isWithinLimits(pawns[i].position, limits)) {
            return false;
        }
    }
    return true;
}

function noPawnsOnSameField({pawns}: IGameState): boolean {
    let positions = pawns.map(pawn => pawn.position);
    positions.sort(sortPositions);

    for (let i = 1, ie = positions.length; i < ie; i++) {
        if (isSamePosition(positions[i-1], positions[i])) {
            return false;
        }
    }
    return true;
}