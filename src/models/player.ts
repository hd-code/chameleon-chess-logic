import { IPawn } from './pawn';

import { isInteger } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * An enum which represents the four different players.
 * - RED: 0
 * - GREEN: 1
 * - YELLOW: 2
 * - BLUE: 3
 */
export enum EPlayer { RED, GREEN, YELLOW, BLUE }

/** Type guard for `EPlayer`. */
export function isPlayer(player: any): player is EPlayer {
    return isInteger(player) && EPlayer[player] !== undefined;
}

/**
 * Returns true if a player still has pawns on the board and is therefore still
 * alive and taking part in the game.
 * 
 * If you need to check the alive status of all players, use `isPlayersAlive()`.
 */
export function isPlayerAlive(player: EPlayer, pawns: IPawn[]): boolean {
    return isPlayersAlive(pawns)[player];
}

/** Returns an object, which maps all players (red, green, yellow, blue) to a
 * boolean value. That boolean indicates, if the player is alive (true) or not
 * (false). */
export function isPlayersAlive(pawns: IPawn[]): {[p in EPlayer]: boolean} {
    let result = { 0: false, 1: false, 2: false, 3: false };
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        result[pawns[i].player] = true;
    }
    return result;
}

/** Returns the next player who should be on turn. It is important to pass the
 * updated (moved) pawns to this function to work properly. */
export function getNextPlayer(player: EPlayer, pawns: IPawn[]): EPlayer {
    const playersState = isPlayersAlive(pawns);
    let nextPlayer = NEXT_PLAYER[player];

    while (!playersState[nextPlayer]) {
        nextPlayer = NEXT_PLAYER[nextPlayer];
    }

    return nextPlayer;
}

// -----------------------------------------------------------------------------

const NEXT_PLAYER = {
    [EPlayer.RED]: EPlayer.BLUE,
    [EPlayer.GREEN]: EPlayer.RED,
    [EPlayer.YELLOW]: EPlayer.GREEN,
    [EPlayer.BLUE]: EPlayer.YELLOW,
};