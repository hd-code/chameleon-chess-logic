import { Meeple, Color, Limits, Role, Position } from "./main";
import { isColor, isRole, isPosition } from "./helperAdv";
import { isWithinLimits } from "./limits";

/* --------------------------------- Public --------------------------------- */

export function isMeeple(meeple :Meeple) :meeple is Meeple {
    return 'player'   in meeple && isColor(meeple.player)
        && 'roles'    in meeple && isMeepleRoles(meeple.roles)
        && 'position' in meeple && isPosition(meeple.position)
}

export function getDefaultMeeplesForPlayer(player :Color) :Meeple[] {
    return getDefaultMeeples(player)
}

// meeple is the index in allMeeples. Therefore it is just a number. This avoids
// redundance. After all, the meeple always has to be part of allMeeples.
export function nextMoves(meeple :number, allMeeples :Meeple[], limits :Limits,
    board :Color[][]) :Position[]
{
    switch ( getCurrentRole(allMeeples[meeple], board) ) {
        case Role.KNIGHT:
            return knightMoves(meeple, allMeeples, limits)
        case Role.BISHOP:
            return bishopMoves(meeple, allMeeples, limits)
        case Role.ROOK:
            return rookMoves(meeple, allMeeples, limits)
        case Role.QUEEN:
            return bishopMoves(meeple, allMeeples, limits)
                .concat( rookMoves(meeple, allMeeples, limits) )
        default:
            return []
    }
}

export function getIOfMeepleAtPosition(position :Position, allMeeples :Meeple[]) :number {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (   position.row === allMeeples[i].position.row
            && position.col === allMeeples[i].position.col)
                return i
    }
    return -1
}

/* --------------------------------- Intern --------------------------------- */

function isMeepleRoles(r:any): r is {[fieldColor in Color]: Role} {
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

const DEFAULT_ROLES : {[knightColor in Color]: {[fieldColor in Color]: Role}} = {
    [Color.RED]: {
        [Color.RED]:    Role.KNIGHT,
        [Color.GREEN]:  Role.QUEEN,
        [Color.YELLOW]: Role.BISHOP,
        [Color.BLUE]:   Role.ROOK
    },
    [Color.GREEN]: {
        [Color.RED]:    Role.ROOK,
        [Color.GREEN]:  Role.KNIGHT,
        [Color.YELLOW]: Role.QUEEN,
        [Color.BLUE]:   Role.BISHOP
    },
    [Color.YELLOW]: {
        [Color.RED]:    Role.BISHOP,
        [Color.GREEN]:  Role.ROOK,
        [Color.YELLOW]: Role.KNIGHT,
        [Color.BLUE]:   Role.QUEEN
    },
    [Color.BLUE]: {
        [Color.RED]:    Role.QUEEN,
        [Color.GREEN]:  Role.BISHOP,
        [Color.YELLOW]: Role.ROOK,
        [Color.BLUE]:   Role.KNIGHT
    }
}
const DEFAULT_MEEPLES :{[player in Color]: Meeple[]} = {
    [Color.RED]: [
        {
            player: Color.RED,
            roles: DEFAULT_ROLES[Color.RED],
            position: {row: 7, col: 0}
        },
        {
            player: Color.RED,
            roles: DEFAULT_ROLES[Color.GREEN],
            position: {row: 7, col: 1}
        },
        {
            player: Color.RED,
            roles: DEFAULT_ROLES[Color.YELLOW],
            position: {row: 7, col: 2}
        },
        {
            player: Color.RED,
            roles: DEFAULT_ROLES[Color.BLUE],
            position: {row: 7, col: 3}
        },
    ],
    [Color.GREEN]: [
        {
            player: Color.GREEN,
            roles: DEFAULT_ROLES[Color.GREEN],
            position: {row: 7, col: 7}
        },
        {
            player: Color.GREEN,
            roles: DEFAULT_ROLES[Color.YELLOW],
            position: {row: 6, col: 7}
        },
        {
            player: Color.GREEN,
            roles: DEFAULT_ROLES[Color.BLUE],
            position: {row: 5, col: 7}
        },
        {
            player: Color.GREEN,
            roles: DEFAULT_ROLES[Color.RED],
            position: {row: 4, col: 7}
        },
    ],
    [Color.YELLOW]: [
        {
            player: Color.YELLOW,
            roles: DEFAULT_ROLES[Color.YELLOW],
            position: {row: 0, col: 7}
        },
        {
            player: Color.YELLOW,
            roles: DEFAULT_ROLES[Color.BLUE],
            position: {row: 0, col: 6}
        },
        {
            player: Color.YELLOW,
            roles: DEFAULT_ROLES[Color.RED],
            position: {row: 0, col: 5}
        },
        {
            player: Color.YELLOW,
            roles: DEFAULT_ROLES[Color.GREEN],
            position: {row: 0, col: 4}
        },
    ],
    [Color.BLUE]: [
        {
            player: Color.BLUE,
            roles: DEFAULT_ROLES[Color.BLUE],
            position: {row: 0, col: 0}
        },
        {
            player: Color.BLUE,
            roles: DEFAULT_ROLES[Color.RED],
            position: {row: 1, col: 0}
        },
        {
            player: Color.BLUE,
            roles: DEFAULT_ROLES[Color.GREEN],
            position: {row: 2, col: 0}
        },
        {
            player: Color.BLUE,
            roles: DEFAULT_ROLES[Color.YELLOW],
            position: {row: 3, col: 0}
        },
    ],
}
function getDefaultMeeples(player: Color): Meeple[] {
    return DEFAULT_MEEPLES[player]
}

function getCurrentRole(meeple :Meeple, board :Color[][]) :Role {
    let fieldColor = board[meeple.position.row][meeple.position.col]
    return meeple.roles[fieldColor]
}

function knightMoves(meeple :number, allMeeples :Meeple[], limits :Limits) :Position[] {
    let currentPos :Position = allMeeples[meeple].position

    let offsets :Position[] = [
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

function bishopMoves(meeple :number, allMeeples :Meeple[], limits :Limits) :Position[] {    
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 1,-1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1,-1, limits, allMeeples, meeple),
    ]
}

function rookMoves(meeple :number, allMeeples :Meeple[], limits :Limits) :Position[] {
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0,-1, limits, allMeeples, meeple),
    ]
}

enum MoveType { INVALID, NORMAL, BEATING }

function getMoveType(move :Position, limits :Limits, allMeeples :Meeple[], meeple :number) :MoveType {
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

function moveGenerator(startingPos :Position, rowOffset :number, colOffset :number,
    limits :Limits, allMeeples :Meeple[], meeple :number) :Position[] 
{
    let result :Position[] = []
    let tmpPos :Position = {...startingPos}

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