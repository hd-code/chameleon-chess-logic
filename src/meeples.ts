import { IMeeple, EColor, ILimits, ERole, IPosition } from "./main";
import { isColor, isRole, isPosition } from "./helperAdv";
import { isWithinLimits } from "./limits";

/* --------------------------------- Public --------------------------------- */

export function isMeeple(meeple :IMeeple) :meeple is IMeeple {
    return 'player'   in meeple && isColor(meeple.player)
        && 'roles'    in meeple && isMeepleRoles(meeple.roles)
        && 'position' in meeple && isPosition(meeple.position)
}

export function getDefaultMeeplesForPlayer(player :EColor) :IMeeple[] {
    return getDefaultMeeples(player)
}

// meeple is the index in allMeeples. Therefore it is just a number. This avoids
// redundance. After all, the meeple always has to be part of allMeeples.
export function nextMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits,
    board :EColor[][]) :IPosition[]
{
    switch ( getCurrentRole(allMeeples[meeple], board) ) {
        case ERole.KNIGHT:
            return knightMoves(meeple, allMeeples, limits)
        case ERole.BISHOP:
            return bishopMoves(meeple, allMeeples, limits)
        case ERole.ROOK:
            return rookMoves(meeple, allMeeples, limits)
        case ERole.QUEEN:
            return bishopMoves(meeple, allMeeples, limits)
                .concat( rookMoves(meeple, allMeeples, limits) )
        default:
            return []
    }
}

export function getIOfMeepleAtPosition(position :IPosition, allMeeples :IMeeple[]) :number {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (   position.row === allMeeples[i].position.row
            && position.col === allMeeples[i].position.col)
                return i
    }
    return -1
}

/* --------------------------------- Intern --------------------------------- */

function isMeepleRoles(r:any): r is {[fieldColor in EColor]: ERole} {
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

const DEFAULT_ROLES : {[knightColor in EColor]: {[fieldColor in EColor]: ERole}} = {
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
const DEFAULT_MEEPLES :{[player in EColor]: IMeeple[]} = {
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
function getDefaultMeeples(player: EColor): IMeeple[] {
    return DEFAULT_MEEPLES[player]
}

function getCurrentRole(meeple :IMeeple, board :EColor[][]) :ERole {
    let fieldColor = board[meeple.position.row][meeple.position.col]
    return meeple.roles[fieldColor]
}

function knightMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IPosition[] {
    let currentPos :IPosition = allMeeples[meeple].position

    let offsets :IPosition[] = [
        {row: 2, col: 1}, {row: 1, col: 2},
        {row:-2, col: 1}, {row:-1, col: 2},
        {row: 2, col:-1}, {row: 1, col:-2},
        {row:-2, col:-1}, {row:-1, col:-2},
    ]

    let result = offsets.map(offset => {
        return {
            row: currentPos.row + offset.row,
            col: currentPos.col + offset.col
        }
    })

    // only return move if it is not INVALID
    return result.filter(position => {
        return getMoveType(position, limits, allMeeples, meeple)
    })
}

function bishopMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IPosition[] {    
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 1,-1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1,-1, limits, allMeeples, meeple),
    ]
}

function rookMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IPosition[] {
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0,-1, limits, allMeeples, meeple),
    ]
}

enum MoveType { INVALID, NORMAL, BEATING }

function getMoveType(move :IPosition, limits :ILimits, allMeeples :IMeeple[], meeple :number) :MoveType {
    let meepleToMove  = allMeeples[meeple]
    let meepleOnField = allMeeples[getIOfMeepleAtPosition(move, allMeeples)]

    if (!isWithinLimits(move, limits))
        return MoveType.INVALID

    if (!meepleOnField)
        return MoveType.NORMAL

    if (meepleOnField.player !== meepleToMove.player)
        return MoveType.BEATING

    return MoveType.INVALID
}

function moveGenerator(startingPos :IPosition, rowOffset :number, colOffset :number,
    limits :ILimits, allMeeples :IMeeple[], meeple :number) :IPosition[] 
{
    let result :IPosition[] = []
    let tmpPos :IPosition = {...startingPos}

    while (true) {
        tmpPos.row += rowOffset
        tmpPos.col += colOffset
        let moveType = getMoveType(tmpPos, limits, allMeeples, meeple)

        // don't add move if it's invalid
        if (moveType !== MoveType.INVALID)
            result.push(tmpPos)

        // stop generator if invalid or beating was encountered
        if (moveType !== MoveType.NORMAL)
            break;
    }

    return result
}