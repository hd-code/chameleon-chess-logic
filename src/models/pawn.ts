import { EFieldColor, getFieldColor, IPosition, isPosition, isSamePosition } from './board';
import { ILimits, isWithinLimits, isSmallestLimits } from './limits';
import { EPlayer, isPlayer } from './player';
import { ERole, TRoles, isRoles, getRoles } from './roles';

import { deepClone } from '../../lib/aux';
import { hasKey } from '../../lib/type-guards';

// -----------------------------------------------------------------------------

/**
 * This data structure represents a pawn. Each player has four of these initially.
 * 
 * A pawn has the following properties:
 * - `player`: the player this pawn belongs to (type: `EPlayer`)
 * - `position`: the current position of the pawn on the game board (type: `IPosition`)
 * - `roles`: an object that maps a field color (`EFieldColor`) to the role (`ERole`)
 * the pawn has, when it is on a field of that color
 * 
 * The pawns are stored in the game state object (`IGameState`). However, only
 * alive pawns are stored there. So, if a pawn is beaten, it will be removed
 * from the array. Therefore, pawns do **not** need an `alive`-flag or something
 * similar.
 */
export interface IPawn {
    /** the player this pawn belongs to */
    player: EPlayer;
    /** the current position of the pawn on the game board */
    position: IPosition;
    /**  an object that maps a field color (`EFieldColor`) to the role (`ERole`) the pawn has, when it is on a field of that color */
    roles: TRoles;
}

/** Type guard for `IPawn`. */
export function isPawn(pawn: any): pawn is IPawn {
    return hasKey(pawn, 'player', isPlayer)
        && hasKey(pawn, 'position', isPosition)
        && hasKey(pawn, 'roles', isRoles);
}

/** Returns the pawns in start position for a given player. */
export function getPawns(player: EPlayer): IPawn[] {
    return deepClone(START_PAWNS[player]);
}

/** Checks if a pawn is on a given field. If so, the index of the pawn in the
 * pawns array is returned. If the field is empty, -1 is returned. */
export function getIndexOfPawnAtPosition(pawns: IPawn[], position: IPosition): number {
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        if (isSamePosition(pawns[i].position, position)) return i;
    }
    return -1;
}

/**
 * Returns all the possible moves a given pawn can do. The moves are represented
 * by an array of `IPosition`s, which are the fields the pawn can reach.
 * 
 * Returns an empty array if a non-existing index was passed.
 */
export function getMoves(pawns: IPawn[], pawnIndex: number, limits: ILimits): IPosition[] {
    const pawn = pawns?.[pawnIndex];
    if (!pawn) return [];

    const fieldColor = getFieldColor(pawn.position);

    switch (pawn.roles[fieldColor]) {
        case ERole.KNIGHT:
            return getKnightMoves(pawns, pawnIndex, limits);

        case ERole.QUEEN:
            return getBishopMoves(pawns, pawnIndex, limits)
                .concat(getRookMoves(pawns, pawnIndex, limits));

        case ERole.BISHOP:
            return getBishopMoves(pawns, pawnIndex, limits);

        case ERole.ROOK:
            return getRookMoves(pawns, pawnIndex, limits);
    }
}

/** Checks if there is a pawn in deadlock and returns its index in the pawns
 * array. This occurs when the board has shrunken to the smallest possible size
 * (3x3). If a pawn happens to be a knight on the center field, it can no longer
 * do any move. Therefore, it is in deadlock. */
export function getIndexOfPawnInDeadlock(pawns: IPawn[], limits: ILimits): number {
    if (!isSmallestLimits(limits)) return -1;
    
    const centerPos = {
        row: limits.minRow + 1,
        col: limits.minCol + 1
    };

    const pawnIAtCenter = getIndexOfPawnAtPosition(pawns, centerPos);
    if (pawnIAtCenter === -1) return -1;

    const pawn = pawns[pawnIAtCenter];
    const role = pawn.roles[getFieldColor(pawn.position)];
    
    return role === ERole.KNIGHT ? pawnIAtCenter : -1;
}

// -----------------------------------------------------------------------------

// The start pawns for the different players. The players are the key and their
// corresponding pawns in start position are the value.
const START_PAWNS = {
    [EPlayer.RED]: [
        createPawn(EPlayer.RED, EFieldColor.RED,    7, 0),
        createPawn(EPlayer.RED, EFieldColor.GREEN,  7, 1),
        createPawn(EPlayer.RED, EFieldColor.YELLOW, 7, 2),
        createPawn(EPlayer.RED, EFieldColor.BLUE,   7, 3),
    ],
    [EPlayer.GREEN]: [
        createPawn(EPlayer.GREEN, EFieldColor.GREEN,  7, 7),
        createPawn(EPlayer.GREEN, EFieldColor.YELLOW, 6, 7),
        createPawn(EPlayer.GREEN, EFieldColor.BLUE,   5, 7),
        createPawn(EPlayer.GREEN, EFieldColor.RED,    4, 7),
    ],
    [EPlayer.YELLOW]: [
        createPawn(EPlayer.YELLOW, EFieldColor.YELLOW, 0, 7),
        createPawn(EPlayer.YELLOW, EFieldColor.BLUE,   0, 6),
        createPawn(EPlayer.YELLOW, EFieldColor.RED,    0, 5),
        createPawn(EPlayer.YELLOW, EFieldColor.GREEN,  0, 4),
    ],
    [EPlayer.BLUE]: [
        createPawn(EPlayer.BLUE, EFieldColor.BLUE,   0, 0),
        createPawn(EPlayer.BLUE, EFieldColor.RED,    1, 0),
        createPawn(EPlayer.BLUE, EFieldColor.GREEN,  2, 0),
        createPawn(EPlayer.BLUE, EFieldColor.YELLOW, 3, 0),
    ],
};

function createPawn(player: EPlayer, knightColor: EFieldColor, row: number, col: number): IPawn {
    return {
        player,
        position: { row, col },
        roles: getRoles(knightColor)
    };
}

function getKnightMoves(pawns: IPawn[], pawnI: number, limits: ILimits): IPosition[] {
    const currentPos: IPosition = pawns[pawnI].position;

    const offsets: IPosition[] = [
        {row: 2, col: 1}, {row: 1, col: 2},
        {row:-2, col: 1}, {row:-1, col: 2},
        {row: 2, col:-1}, {row: 1, col:-2},
        {row:-2, col:-1}, {row:-1, col:-2},
    ];

    const result = offsets.map(offset => ({
        row: currentPos.row + offset.row,
        col: currentPos.col + offset.col
    }));

    // only return move if it is not INVALID
    return result.filter(position => getMoveType(pawns, pawnI, position, limits));
}

function getBishopMoves(pawns: IPawn[], pawnI: number, limits: ILimits): IPosition[] {
    return [
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col:-1 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col:-1 }),
    ];
}

function getRookMoves(pawns: IPawn[], pawnI: number, limits: ILimits): IPosition[] {
    return [
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col: 0 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col: 0 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 0, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 0, col:-1 }),
    ];
}

/**
 * Returns an array of possible moves starting (not including) at the pawns
 * current postion. It than moves step by step from the start position along the
 * direction given by the `offset` parameter. It does that as long as the found
 * positions are valid moves and stops once that is no longer the case.
 * @param offset Offset in row and col direction per step
 */
function moveGenerator(pawns: IPawn[], pawnI: number, limits: ILimits, offset: IPosition): IPosition[] {
    const startingPos = pawns[pawnI].position;

    let result :IPosition[] = [];
    let currentPos :IPosition = {...startingPos};

    while (true) {
        currentPos.row += offset.row;
        currentPos.col += offset.col;
        let moveType = getMoveType(pawns, pawnI, currentPos, limits);

        // don't add move if it's invalid
        if (moveType !== MoveType.INVALID) result.push({...currentPos});

        // stop generator if invalid or beating was encountered
        if (moveType !== MoveType.NORMAL) break;
    }

    return result;
}

enum MoveType { INVALID, NORMAL, BEATING }

function getMoveType(pawns: IPawn[], pawnI: number, destination: IPosition, limits: ILimits): MoveType {
    const pawnToMove  = pawns[pawnI];
    const pawnOnField = pawns[getIndexOfPawnAtPosition(pawns, destination)];

    if (!isWithinLimits(destination, limits)) return MoveType.INVALID;

    if (!pawnOnField) return MoveType.NORMAL;

    if (pawnOnField.player !== pawnToMove.player) return MoveType.BEATING;

    return MoveType.INVALID;
}