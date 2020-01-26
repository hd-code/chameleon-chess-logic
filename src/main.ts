import { makeBestMove } from "./ai";

import { TBoard, getBoard as getBoardModels } from "./models/Board";
import { EColor } from "./models/Color";
import * as GS from "./models/GameState"
import * as Pawns from "./models/Pawns"
import { IPosition } from "./models/Position";

// ----------------------------------- Types -----------------------------------

export { EColor } from "./models/Color";
export { ERole, TRoles } from "./models/Roles";
export { TBoard } from "./models/Board";
export { IGameState } from "./models/GameState";
export { ILimits } from "./models/Limits";
export { IPawn } from "./models/Pawns";
export { IPosition } from "./models/Position";

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
 * Starts a new game and returns the corresponding game state object.
 * 
 * Up to four players can play in a game. Players are linked to a color. So
 * there is a red, green, yellow and a blue player. For each player a boolean
 * is passed as a parameter to indicate, if this player takes part in the game
 * or not. (`true` means the player takes part in the game)
 * 
 * A minimum of two players are required for a game. If too few players were
 * provided in the params, this function will return `null` as no game can be
 * played anyway.
 * 
 * @param red    If set to `true`, the red    player takes part in this game.
 * @param green  If set to `true`, the green  player takes part in this game.
 * @param yellow If set to `true`, the yellow player takes part in this game.
 * @param blue   If set to `true`, the blue   player takes part in this game.
 */
export function initGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): GS.IGameState|null {
    const gs = GS.createGameState(red, green, yellow, blue)
    return !GS.isGameOver(gs) ? gs : null
}

/**
 * Checks if one of the pawns is located at the given position. If so, the index
 * of that pawn in the pawns array of the game state is returned. If the given
 * position is empty, this function returns `-1`.
 * @param gs       The current game state
 * @param position The field to search for a pawn
 */
export function getIndexOfPawnAtPosition(gs: GS.IGameState, position: IPosition):number {
    return Pawns.getIndexOfPawnAtPosition(position, gs.pawns);
}

/**
 * Returns an array of possible moves (type `IPosition`) for a given pawn. If
 * the pawn doesn't exist or anything else goes wrong, an empty array is
 * returned.
 * @param gs        The current game state
 * @param pawnIndex The index of the pawn in the pawns array of the game state whose moves should be calculated.
 */
export function getMoves(gs: GS.IGameState, pawnIndex: number): IPosition[] {
    return gs.pawns[pawnIndex] !== undefined
        ? Pawns.getNextMoves(pawnIndex, gs.pawns, gs.limits)
        : [];
}

/**
 * Advances the game by one turn. It moves the pawn to the destination and
 * returns the updated game state. If anything is wrong, it returns `null`.
 * 
 * Possible errors:
 * - invalid game state, 
 * - game is already over, 
 * - pawn doesn't exist or doesn't belong to the player whose turn it is 
 * - destination is not available to the pawn right now
 * 
 * @param gs          The current game state.
 * @param pawnIndex   The index of the pawn in the pawns array in the game state
 * @param destination The destination where the pawn should go to
 */
export function makeMove(gs: GS.IGameState, pawnIndex: number, destination: IPosition): GS.IGameState|null {
    return GS.isValidMove(gs, pawnIndex, destination)
        ? GS.makeMove(gs, pawnIndex, destination)
        : null;
}

/**
 * The computer will make a move and return the updated game state.
 * @param gs  The current game state
 */
export function letComputerMakeMove(gs: GS.IGameState): GS.IGameState {
    return makeBestMove(gs);
}

/**
 * Checks which of the players are still alive in the current game state.
 * Returns an object with an entry for each player (player color is the key).
 * The value is a boolean indicating wether the player is still alive (`true`)
 * or not (`false`).
 * @param gs The current game state
 */
export function arePlayersAlive(gs: GS.IGameState): {[player in EColor]: boolean} {
    return GS.arePlayersAlive(gs);
}

/**
 * Checks the given game state if the game is over or if it can still be played.
 * This function returns `true` if the game is finished, false if it can still
 * continue.
 * @param gs The current game state
 */
export function isGameOver(gs: GS.IGameState): boolean {
    return GS.isGameOver(gs);
}

/**
 * Checks if a given game state really is a game state. It checks all the types
 * and keys. It also checks, if the information within the game state is valid.
 * E.g. it checks if the player whose turn it is, is actually alive or if there
 * are any pawns at the same field or outside the limits (both rendering the
 * game state incorrect).
 * @param gs  The game state to be checked
 */
export function isValidGameState(gs: any): gs is GS.IGameState {
    return GS.isGameState(gs);
}