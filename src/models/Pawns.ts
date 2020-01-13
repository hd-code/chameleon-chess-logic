import { getFieldColor } from "./Board";
import { EColor, isColor } from "./Color";
import { ILimits, isPositionWithinLimits } from "./Limits";
import { IPosition, isPosition, isSamePosition } from "./Position";
import { ERole, isRole } from "./Role";

import { isKeyOfObject, deepClone } from "../lib/hd-helper";

// -----------------------------------------------------------------------------

export interface IPawn {
    player:  EColor;
    position:IPosition;
    roles:   TColorRoleMap;
}

export type TColorRoleMap = {[fieldColor in EColor]: ERole}

export function isPawn(pawn: any): pawn is IPawn {
    return isKeyOfObject(pawn, 'player', isColor)
        && isKeyOfObject(pawn, 'position', isPosition)
        && isKeyOfObject(pawn, 'roles', isPawnRoles);
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

export function getPawnAtPosition(position: IPosition, pawns: IPawn[]): IPawn|null {
    const result = pawns.filter(p => isSamePosition(p.position, position));
    return result.length === 0 ? null : result[0];
}

/** Returns -1 if the pawn was not found. */
export function getIndexOfPawn(pawn: IPawn, pawns: IPawn[]): number {
    return pawns.indexOf(pawn);
}

/** Returns -1 if there is no pawn at the specified position. */
export function getIndexOfPawnAtPosition(position: IPosition, pawns: IPawn[]): number {
    const pawn = getPawnAtPosition(position, pawns);
    return pawn == null ? -1 : getIndexOfPawn(pawn, pawns);
}

/** pawnI is the index in pawns[]. Therefore it is just a number. This avoids 
 * redundance. After all, the pawn always has to be part of pawns[]. */
export function getNextMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    switch ( getCurrentRole(pawns[pawnI]) ) {
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

function isPawnRoles(r:any): r is TColorRoleMap {
    if (!isColorRoleMap(r))
        return false;

    const legalRoles = [
        getRoles(EColor.RED),    getRoles(EColor.GREEN),
        getRoles(EColor.YELLOW), getRoles(EColor.BLUE),
    ];

    for (let i = 0, ie = legalRoles.length; i < ie; i++) {
        if (    legalRoles[i][EColor.RED]    === r[EColor.RED]
             && legalRoles[i][EColor.GREEN]  === r[EColor.GREEN]
             && legalRoles[i][EColor.YELLOW] === r[EColor.YELLOW]
             && legalRoles[i][EColor.BLUE]   === r[EColor.BLUE]
        )
            return true;
    }

    return false;
}

function isColorRoleMap(r: any): r is TColorRoleMap {
    return isKeyOfObject<TColorRoleMap,ERole>(r, EColor.RED, isRole)
        && isKeyOfObject<TColorRoleMap,ERole>(r, EColor.GREEN, isRole)
        && isKeyOfObject<TColorRoleMap,ERole>(r, EColor.YELLOW, isRole)
        && isKeyOfObject<TColorRoleMap,ERole>(r, EColor.BLUE, isRole);
}

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

/*
RED = 0,    GREEN = 1, YELLOW = 2, BLUE = 3
KNIGHT = 0, QUEEN = 1, BISHOP = 2, ROOK = 3

            |       fieldColor
knightColor | RED    | GREEN  | YELLOW | BLUE
------------|--------|--------|--------|--------
     RED    | KNIGHT | ROOK   | BISHOP | QUEEN
     GREEN  | QUEEN  | KNIGHT | ROOK   | BISHOP
     YELLOW | BISHOP | QUEEN  | KNIGHT | ROOK
     BLUE   | ROOK   | BISHOP | QUEEN  | KNIGHT

knightColor -> offset of role in color array
*/
function getRoles(knightColor: EColor): {[fieldColor in EColor]: ERole} {
    const roles = [ERole.KNIGHT, ERole.QUEEN, ERole.BISHOP, ERole.ROOK];
    const numRoles = roles.length;

    const result = roles.map((_,i) => {
        let index = i - knightColor;
        if (index < 0) index += numRoles;
        return roles[index];
    });

    return {
        [EColor.RED]:    result[EColor.RED],
        [EColor.GREEN]:  result[EColor.GREEN],
        [EColor.YELLOW]: result[EColor.YELLOW],
        [EColor.BLUE]:   result[EColor.BLUE],
    };
}

function getCurrentRole(pawn: IPawn): ERole {
    let fieldColor = getFieldColor(pawn.position);
    return pawn.roles[fieldColor];
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