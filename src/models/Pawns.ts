import { getFieldColor } from "./Board";
import { EColor, isColor } from "./Color";
import { ILimits, isPositionWithinLimits, isSmallestFieldSize } from "./Limits";
import { IPosition, isPosition, isSamePosition } from "./Position";
import { ERole, TRoles, isRoles, getRoles } from "./Roles";

import { isKeyOfObject, deepClone } from "../../lib/hd-helper";

// -----------------------------------------------------------------------------

export interface IPawn {
    player:  EColor;
    position:IPosition;
    roles:   TRoles;
}

export function isPawn(pawn: any): pawn is IPawn {
    return isKeyOfObject(pawn, 'player', isColor)
        && isKeyOfObject(pawn, 'position', isPosition)
        && isKeyOfObject(pawn, 'roles', isRoles);
}

export function areAllPawnsWithinLimits(pawns: IPawn[], limits: ILimits): boolean {
    const pawnsWithinLimits = pawns.filter(pawn => isPositionWithinLimits(pawn.position, limits));
    return pawnsWithinLimits.length === pawns.length;
}

export function areTherePawnsOnTheSameField(pawns: IPawn[]): boolean {
    const orderedPawns = deepClone(pawns).sort((a,b) => a.position.row - b.position.row);

    for (let i = 1, ie = orderedPawns.length; i < ie; i++) {
        if (isSamePosition(orderedPawns[i-1].position, orderedPawns[i].position))
            return true;
    }

    return false;
}

export function getDefaultPawnsForPlayer(player: EColor): IPawn[] {
    return DEFAULT_PAWNS[player];
}

export function getNumOfPawnsPerPlayer(pawns: IPawn[]): {[player in EColor]: number} {
    let result = {
        [EColor.RED]:    0, [EColor.GREEN]: 0,
        [EColor.YELLOW]: 0, [EColor.BLUE]:  0
    };
    pawns.forEach(pawn => result[pawn.player]++);
    return result;
}

/** Returns -1 if the pawn was not found. */
export function getIndexOfPawn(pawn: IPawn, pawns: IPawn[]): number {
    return pawns.indexOf(pawn);
}

/** Returns -1 if there is no pawn at the specified position. */
export function getIndexOfPawnAtPosition(position: IPosition, pawns: IPawn[]): number {
    const pawnAtPos = pawns.filter(p => isSamePosition(p.position, position));
    return pawnAtPos.length === 0 ? -1 : getIndexOfPawn(pawnAtPos[0], pawns);
}

export function getIndexOfPawnInDeadlock(pawns: IPawn[], limits: ILimits): number {
    if (!isSmallestFieldSize(limits))
        return -1;
    
    const centerPos = {
        row: limits.lower.row + 1,
        col: limits.lower.col + 1
    };

    const pawnAtCenter = getIndexOfPawnAtPosition(centerPos, pawns);
    if (pawnAtCenter === -1)
        return -1;

    const moves = getNextMoves(pawnAtCenter, pawns, limits);
    return moves.length === 0 ? pawnAtCenter : -1;
}

/** pawnI is the index in pawns[]. Therefore it is just a number. This avoids 
 * redundance. After all, the pawn always has to be part of pawns[]. */
export function getNextMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    const pawn = pawns[pawnI];
    switch ( pawn.roles[getFieldColor(pawn.position)] ) {
        case ERole.KNIGHT:
            return knightMoves(pawnI, pawns, limits);
        case ERole.BISHOP:
            return bishopMoves(pawnI, pawns, limits);
        case ERole.ROOK:
            return rookMoves(pawnI, pawns, limits);
        case ERole.QUEEN:
            return bishopMoves(pawnI, pawns, limits)
                .concat( rookMoves(pawnI, pawns, limits) );
        default:
            return [];
    }
}

// -----------------------------------------------------------------------------

const DEFAULT_PAWNS: {[player in EColor]: IPawn[]} = {
    [EColor.RED]: [
        createPawn(EColor.RED, EColor.RED,    7, 0),
        createPawn(EColor.RED, EColor.GREEN,  7, 1),
        createPawn(EColor.RED, EColor.YELLOW, 7, 2),
        createPawn(EColor.RED, EColor.BLUE,   7, 3),
    ],
    [EColor.GREEN]: [
        createPawn(EColor.GREEN, EColor.GREEN,  7, 7),
        createPawn(EColor.GREEN, EColor.YELLOW, 6, 7),
        createPawn(EColor.GREEN, EColor.BLUE,   5, 7),
        createPawn(EColor.GREEN, EColor.RED,    4, 7),
    ],
    [EColor.YELLOW]: [
        createPawn(EColor.YELLOW, EColor.YELLOW, 0, 7),
        createPawn(EColor.YELLOW, EColor.BLUE,   0, 6),
        createPawn(EColor.YELLOW, EColor.RED,    0, 5),
        createPawn(EColor.YELLOW, EColor.GREEN,  0, 4),
    ],
    [EColor.BLUE]: [
        createPawn(EColor.BLUE, EColor.BLUE,   0, 0),
        createPawn(EColor.BLUE, EColor.RED,    1, 0),
        createPawn(EColor.BLUE, EColor.GREEN,  2, 0),
        createPawn(EColor.BLUE, EColor.YELLOW, 3, 0),
    ],
};

function createPawn(player: EColor, knightColor: EColor, row: number, col: number): IPawn {
    return {
        player,
        roles: getRoles(knightColor),
        position: { row, col }
    };
}

function knightMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    const currentPos: IPosition = pawns[pawnI].position;

    const offsets: IPosition[] = [
        {row: 2, col: 1}, {row: 1, col: 2},
        {row:-2, col: 1}, {row:-1, col: 2},
        {row: 2, col:-1}, {row: 1, col:-2},
        {row:-2, col:-1}, {row:-1, col:-2},
    ];

    const result = offsets.map(offset => {
        return {
            row: currentPos.row + offset.row,
            col: currentPos.col + offset.col
        };
    });

    // only return move if it is not INVALID
    return result.filter(position => {
        return getMoveType(position, limits, pawns, pawnI);
    });
}

function bishopMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    return [
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col:-1 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col:-1 }),
    ];
}

function rookMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    return [
        ...moveGenerator(pawns, pawnI, limits, { row: 1, col: 0 }),
        ...moveGenerator(pawns, pawnI, limits, { row:-1, col: 0 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 0, col: 1 }),
        ...moveGenerator(pawns, pawnI, limits, { row: 0, col:-1 }),
    ];
}

enum MoveType { INVALID, NORMAL, BEATING }

function getMoveType(move: IPosition, limits: ILimits, pawns: IPawn[], pawnI: number): MoveType {
    const pawnToMove  = pawns[pawnI];
    const pawnOnField = pawns[getIndexOfPawnAtPosition(move, pawns)];

    if (!isPositionWithinLimits(move, limits))
        return MoveType.INVALID;

    if (!pawnOnField)
        return MoveType.NORMAL;

    if (pawnOnField.player !== pawnToMove.player)
        return MoveType.BEATING;

    return MoveType.INVALID;
}

/** returns possible moves of a pawn, starting at its current position toward
 * the given offset.
 * 
 * @param offset Offset in row and col direction per step
 */
function moveGenerator(pawns: IPawn[], pawnI: number, limits: ILimits, offset: IPosition): IPosition[] {
    const startingPos = pawns[pawnI].position;

    let result :IPosition[] = [];
    let currentPos :IPosition = deepClone(startingPos);

    while (true) {
        currentPos.row += offset.row;
        currentPos.col += offset.col;
        let moveType = getMoveType(currentPos, limits, pawns, pawnI);

        // don't add move if it's invalid
        if (moveType !== MoveType.INVALID)
            result.push(deepClone(currentPos));

        // stop generator if invalid or beating was encountered
        if (moveType !== MoveType.NORMAL)
            break;
    }

    return result;
}