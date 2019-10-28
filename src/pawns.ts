import { EColor, isColor, ERole, isRole, IPosition, isPosition, Board } from "./basic";
import { ILimits, isWithinLimits } from "./limits";
import { deepClone } from "./helper";

/* --------------------------------- Public --------------------------------- */

export interface IPawn {
    player:  EColor
    roles:   {[fieldColor in EColor]: ERole}
    position:IPosition
}

export function isPawn(pawn: IPawn): pawn is IPawn {
    return 'player'   in pawn && isColor(pawn.player)
        && 'roles'    in pawn && isPawnRoles(pawn.roles)
        && 'position' in pawn && isPosition(pawn.position)
}

export function getDefaultPawnsForPlayer(player: EColor): IPawn[] {
    return getDefaultPawns(player)
}

// pawnI is the index in pawns. Therefore it is just a number. This avoids
// redundance. After all, the pawn always has to be part of pawns.
export function nextMoves(pawnI: number, pawns: IPawn[], limits: ILimits, board: Board): IPosition[]
{
    switch ( getCurrentRole(pawns[pawnI], board) ) {
        case ERole.KNIGHT:
            return knightMoves(pawnI, pawns, limits)
        case ERole.BISHOP:
            return bishopMoves(pawnI, pawns, limits)
        case ERole.ROOK:
            return rookMoves(pawnI, pawns, limits)
        case ERole.QUEEN:
            return bishopMoves(pawnI, pawns, limits)
                .concat( rookMoves(pawnI, pawns, limits) )
        default:
            return []
    }
}

export function getIOfPawnAtPosition(position: IPosition, pawns: IPawn[]): number {
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        if (   position.row === pawns[i].position.row
            && position.col === pawns[i].position.col)
                return i
    }
    return -1
}

export function getIOfPawn(pawn: IPawn, pawns: IPawn[]): number {
    return pawns.indexOf(pawn)
}

/* --------------------------------- Intern --------------------------------- */

function isPawnRoles(r:any): r is {[fieldColor in EColor]: ERole} {
    let keys = Object.keys(r)
    if (!keys)
        return false

    let nkeys = keys.map(key => parseInt(key))
    return nkeys.reduce((result, key) => {
        if (!isColor(key) || !isRole(r[key]))
            return false

        return result
    }, <boolean>true)
}

const DEFAULT_ROLES: {[knightColor in EColor]: {[fieldColor in EColor]: ERole}} = {
    [EColor.RED]: {
        [EColor.RED]:    ERole.KNIGHT,
        [EColor.GREEN]:  ERole.QUEEN,
        [EColor.YELLOW]: ERole.BISHOP,
        [EColor.BLUE]:   ERole.ROOK
    },
    [EColor.GREEN]: {
        [EColor.RED]:    ERole.ROOK,
        [EColor.GREEN]:  ERole.KNIGHT,
        [EColor.YELLOW]: ERole.QUEEN,
        [EColor.BLUE]:   ERole.BISHOP
    },
    [EColor.YELLOW]: {
        [EColor.RED]:    ERole.BISHOP,
        [EColor.GREEN]:  ERole.ROOK,
        [EColor.YELLOW]: ERole.KNIGHT,
        [EColor.BLUE]:   ERole.QUEEN
    },
    [EColor.BLUE]: {
        [EColor.RED]:    ERole.QUEEN,
        [EColor.GREEN]:  ERole.BISHOP,
        [EColor.YELLOW]: ERole.ROOK,
        [EColor.BLUE]:   ERole.KNIGHT
    }
}
const DEFAULT_PAWNS: {[player in EColor]: IPawn[]} = {
    [EColor.RED]: [
        {
            player: EColor.RED,
            roles: DEFAULT_ROLES[EColor.RED],
            position: {row: 7, col: 0}
        },
        {
            player: EColor.RED,
            roles: DEFAULT_ROLES[EColor.GREEN],
            position: {row: 7, col: 1}
        },
        {
            player: EColor.RED,
            roles: DEFAULT_ROLES[EColor.YELLOW],
            position: {row: 7, col: 2}
        },
        {
            player: EColor.RED,
            roles: DEFAULT_ROLES[EColor.BLUE],
            position: {row: 7, col: 3}
        },
    ],
    [EColor.GREEN]: [
        {
            player: EColor.GREEN,
            roles: DEFAULT_ROLES[EColor.GREEN],
            position: {row: 7, col: 7}
        },
        {
            player: EColor.GREEN,
            roles: DEFAULT_ROLES[EColor.YELLOW],
            position: {row: 6, col: 7}
        },
        {
            player: EColor.GREEN,
            roles: DEFAULT_ROLES[EColor.BLUE],
            position: {row: 5, col: 7}
        },
        {
            player: EColor.GREEN,
            roles: DEFAULT_ROLES[EColor.RED],
            position: {row: 4, col: 7}
        },
    ],
    [EColor.YELLOW]: [
        {
            player: EColor.YELLOW,
            roles: DEFAULT_ROLES[EColor.YELLOW],
            position: {row: 0, col: 7}
        },
        {
            player: EColor.YELLOW,
            roles: DEFAULT_ROLES[EColor.BLUE],
            position: {row: 0, col: 6}
        },
        {
            player: EColor.YELLOW,
            roles: DEFAULT_ROLES[EColor.RED],
            position: {row: 0, col: 5}
        },
        {
            player: EColor.YELLOW,
            roles: DEFAULT_ROLES[EColor.GREEN],
            position: {row: 0, col: 4}
        },
    ],
    [EColor.BLUE]: [
        {
            player: EColor.BLUE,
            roles: DEFAULT_ROLES[EColor.BLUE],
            position: {row: 0, col: 0}
        },
        {
            player: EColor.BLUE,
            roles: DEFAULT_ROLES[EColor.RED],
            position: {row: 1, col: 0}
        },
        {
            player: EColor.BLUE,
            roles: DEFAULT_ROLES[EColor.GREEN],
            position: {row: 2, col: 0}
        },
        {
            player: EColor.BLUE,
            roles: DEFAULT_ROLES[EColor.YELLOW],
            position: {row: 3, col: 0}
        },
    ],
}
function getDefaultPawns(player: EColor): IPawn[] {
    return DEFAULT_PAWNS[player]
}

function getCurrentRole(pawn: IPawn, board: Board): ERole {
    let fieldColor = board[pawn.position.row][pawn.position.col]
    return pawn.roles[fieldColor]
}

function knightMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    const currentPos: IPosition = pawns[pawnI].position

    const offsets: IPosition[] = [
        {row: 2, col: 1}, {row: 1, col: 2},
        {row:-2, col: 1}, {row:-1, col: 2},
        {row: 2, col:-1}, {row: 1, col:-2},
        {row:-2, col:-1}, {row:-1, col:-2},
    ]

    const result = offsets.map(offset => {
        return {
            row: currentPos.row + offset.row,
            col: currentPos.col + offset.col
        }
    })

    // only return move if it is not INVALID
    return result.filter(position => {
        return getMoveType(position, limits, pawns, pawnI)
    })
}

function bishopMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {    
    let startingPos = pawns[pawnI].position
    return [
        ...moveGenerator(startingPos, 1, 1, limits, pawns, pawnI),
        ...moveGenerator(startingPos,-1, 1, limits, pawns, pawnI),
        ...moveGenerator(startingPos, 1,-1, limits, pawns, pawnI),
        ...moveGenerator(startingPos,-1,-1, limits, pawns, pawnI),
    ]
}

function rookMoves(pawnI: number, pawns: IPawn[], limits: ILimits): IPosition[] {
    let startingPos = pawns[pawnI].position
    return [
        ...moveGenerator(startingPos, 1, 0, limits, pawns, pawnI),
        ...moveGenerator(startingPos,-1, 0, limits, pawns, pawnI),
        ...moveGenerator(startingPos, 0, 1, limits, pawns, pawnI),
        ...moveGenerator(startingPos, 0,-1, limits, pawns, pawnI),
    ]
}

enum MoveType { INVALID, NORMAL, BEATING }

function getMoveType(move: IPosition, limits: ILimits, pawns: IPawn[], pawnI: number): MoveType {
    const pawnToMove  = pawns[pawnI]
    const pawnOnField = pawns[getIOfPawnAtPosition(move, pawns)]

    if (!isWithinLimits(move, limits))
        return MoveType.INVALID

    if (!pawnOnField)
        return MoveType.NORMAL

    if (pawnOnField.player !== pawnToMove.player)
        return MoveType.BEATING

    return MoveType.INVALID
}

function moveGenerator(startingPos: IPosition, rowOffset: number, colOffset: number, limits: ILimits, pawns: IPawn[], pawnI: number): IPosition[] 
{
    let result :IPosition[] = []
    let tmpPos :IPosition = {...startingPos}

    while (true) {
        tmpPos.row += rowOffset
        tmpPos.col += colOffset
        let moveType = getMoveType(tmpPos, limits, pawns, pawnI)

        // don't add move if it's invalid
        if (moveType !== MoveType.INVALID)
            result.push(deepClone(tmpPos))

        // stop generator if invalid or beating was encountered
        if (moveType !== MoveType.NORMAL)
            break;
    }

    return result
}