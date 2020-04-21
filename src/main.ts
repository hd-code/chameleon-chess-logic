import { makeBestMove } from './ai';

import { TBoard, getBoard as getBoardModels } from './models/Board';
import { EColor } from './models/Color';
import * as Game from './models/Game'
import * as Pawns from './models/Pawns'
import { IPosition } from './models/Position';

// ----------------------------------- Types -----------------------------------

export { EColor } from './models/Color';
export { ERole, TRoles } from './models/Roles';
export { TBoard } from './models/Board';
export { IGame } from './models/Game';
export { ILimits } from './models/Limits';
export { IPawn } from './models/Pawns';
export { IPosition } from './models/Position';

// --------------------------------- Functions ---------------------------------

/**
 * Returns a 2 dimensional array of colors. These colors represent the colors of
 * the fields on the board. There are 8x8 fields.
 * 
 * This board has always the same layout in all games. So, this value might be
 * retrieved on startup of your application and stored for usage.
 */
export function getBoard(): TBoard {
    return getBoardModels();
}

/**
 * Creates a new `IGame`-Object. Thus, it generates a new game in the starting
 * configuration.
 * 
 * Up to four players can participate in a game. Players are linked to a color.
 * So, there is a red, green, yellow and a blue player. For each player a
 * boolean is passed as a parameter to indicate, if this player takes part in
 * the game or not (`true` means the player takes part in the game).
 * 
 * A minimum of two players are required for a game. If too few players were
 * provided in the params, this function will return `null` as no game can be
 * played anyway.
 * @param red    If set to `true`, the red    player takes part in this game.
 * @param green  If set to `true`, the green  player takes part in this game.
 * @param yellow If set to `true`, the yellow player takes part in this game.
 * @param blue   If set to `true`, the blue   player takes part in this game.
 */
export function createGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): Game.IGame|null {
    const game = Game.createGame(red, green, yellow, blue)
    return !Game.isGameOver(game) ? game : null
}

/**
 * This function gets a game object and a position passed. If there is a pawn at
 * the given position, the index of that pawn in the pawn array of the game
 * object (`game.pawns[index]`) is returned. If there is no pawn at the given
 * position, this function returns `-1`.
 * @param game     The current game object.
 * @param position The field to search for a pawn.
 */
export function getIndexOfPawnAtPosition(game: Game.IGame, position: IPosition):number {
    return Pawns.getIndexOfPawnAtPosition(position, game.pawns);
}

/**
 * Returns an array of positions. These are the possible destinations the given
 * pawn can reach (thus, the moves it can do).
 * 
 * As parameters you need to pass the current game object and the index of the
 * pawn in the pawns array of the game object.
 * 
 * If the given index is invalid, this function returns an empty array (`[]`).
 * @param game      The current game object.
 * @param pawnIndex The index of the pawn in the pawns array of the game object whose moves should be calculated.
 */
export function getMoves(game: Game.IGame, pawnIndex: number): IPosition[] {
    return game.pawns[pawnIndex] !== undefined
        ? Pawns.getNextMoves(pawnIndex, game.pawns, game.limits)
        : [];
}

/**
 * Advances the game by one turn. It moves the pawn to the destination and
 * returns the updated game object. If anything goes wrong, it returns `null`.
 * 
 * Possible errors:
 * - invalid game object, 
 * - game is already over, 
 * - pawn doesn't exist or doesn't belong to the player whose turn it is 
 * - destination is not available to the pawn right now
 * @param game        The current game object.
 * @param pawnIndex   The index of the pawn in the pawns array in the game object.
 * @param destination The destination where the pawn should go to.
 */
export function makeMove(game: Game.IGame, pawnIndex: number, destination: IPosition): Game.IGame|null {
    return Game.isValidMove(game, pawnIndex, destination)
        ? Game.makeMove(game, pawnIndex, destination)
        : null;
}

/**
 * The computer will make a move and return the updated game object.
 * @param game The current game object.
 */
export function makeComputerMove(game: Game.IGame): Game.IGame {
    return makeBestMove(game);
}

/**
 * Checks which of the players are still alive in the current game object.
 * Returns an object with an entry for each player (player color is the key).
 * The value is a boolean indicating wether the player is still alive (`true`)
 * or not (`false`).
 * @param game The current game object.
 */
export function arePlayersAlive(game: Game.IGame): {[player in EColor]: boolean} {
    return Game.arePlayersAlive(game);
}

/**
 * Checks the given game object if the game is over or if it can still be played.
 * This function returns `true` if the game is finished, `false` if it can still
 * continue.
 * @param game The current game object.
 */
export function isGameOver(game: Game.IGame): boolean {
    return Game.isGameOver(game);
}

/**
 * Checks if a given game object really is valid. It checks all the types and
 * keys. It also checks, if the information within the game object is valid.
 * 
 * E.g. it checks if the player whose turn it is, is actually alive or if there
 * are any pawns at the same field or outside the limits (both rendering the
 * game object incorrect).
 * 
 * For a correct game object, this function returns `true`, for an invalid one,
 * it returns `false`.
 * @param game  The game object to be checked.
 */
export function isGame(game: any): game is Game.IGame {
    return Game.isGame(game);
}