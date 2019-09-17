import { ERoles, isRole, EColors, isColor, IPosition, isPosition, IMove, EMoveType } from "./basic";
import { ILimits, isWithinLimits } from "./limits";

/* --------------------------------- Public --------------------------------- */

export interface IMeeple {
    player: EColors
    roles: {[fieldColor in EColors]: ERoles}
    position: IPosition
}

export function isMeeple(meeple :IMeeple) :meeple is IMeeple {
    return 'player'   in meeple && isColor(meeple.player)
        && 'roles'    in meeple && isMeepleRoles(meeple.roles)
        && 'position' in meeple && isPosition(meeple.position)
}

export function getDefaultMeeplesForPlayer(player :EColors) :IMeeple[] {
    return getDefaultMeeples(player)
}

// meeple is the index in allMeeples. Therefore it is just a number. This avoids
// redundance. After all, the meeple always has to be part of allMeeples.
export function nextMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits,
    board :EColors[][]) :IMove[] 
{
    switch ( getCurrentRole(allMeeples[meeple], board) ) {
        case ERoles.KNIGHT:
            return knightMoves(meeple, allMeeples, limits)
        case ERoles.BISHOP:
            return bishopMoves(meeple, allMeeples, limits)
        case ERoles.ROOK:
            return rookMoves(meeple, allMeeples, limits)
        case ERoles.QUEEN:
            return bishopMoves(meeple, allMeeples, limits)
                .concat( rookMoves(meeple, allMeeples, limits) )
        default:
            return []
    }
}

export function getCurrentRole(meeple :IMeeple, board :EColors[][]) :ERoles {
    let fieldColor = board[meeple.position.row][meeple.position.col]
    return meeple.roles[fieldColor]
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

function isMeepleRoles(r:any): r is {[fieldColor in EColors]: ERoles} {
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

const DEFAULT_ROLES : {[knightColor in EColors]: {[fieldColor in EColors]: ERoles}} = {
    [EColors.RED]: {
        [EColors.RED]:    ERoles.KNIGHT,
        [EColors.GREEN]:  ERoles.QUEEN,
        [EColors.YELLOW]: ERoles.BISHOP,
        [EColors.BLUE]:   ERoles.ROOK
    },
    [EColors.GREEN]: {
        [EColors.RED]:    ERoles.ROOK,
        [EColors.GREEN]:  ERoles.KNIGHT,
        [EColors.YELLOW]: ERoles.QUEEN,
        [EColors.BLUE]:   ERoles.BISHOP
    },
    [EColors.YELLOW]: {
        [EColors.RED]:    ERoles.BISHOP,
        [EColors.GREEN]:  ERoles.ROOK,
        [EColors.YELLOW]: ERoles.KNIGHT,
        [EColors.BLUE]:   ERoles.QUEEN
    },
    [EColors.BLUE]: {
        [EColors.RED]:    ERoles.QUEEN,
        [EColors.GREEN]:  ERoles.BISHOP,
        [EColors.YELLOW]: ERoles.ROOK,
        [EColors.BLUE]:   ERoles.KNIGHT
    }
}
function getDefaultRoles(knightColor: EColors): {[fieldColor in EColors]: ERoles} {
    return DEFAULT_ROLES[knightColor]
}

const DEFAULT_MEEPLES :{[player in EColors]: IMeeple[]} = {
    [EColors.RED]: [
        {
            player: EColors.RED,
            roles: getDefaultRoles(EColors.RED),
            position: {row: 7, col: 0}
        },
        {
            player: EColors.RED,
            roles: getDefaultRoles(EColors.GREEN),
            position: {row: 7, col: 1}
        },
        {
            player: EColors.RED,
            roles: getDefaultRoles(EColors.YELLOW),
            position: {row: 7, col: 2}
        },
        {
            player: EColors.RED,
            roles: getDefaultRoles(EColors.BLUE),
            position: {row: 7, col: 3}
        },
    ],
    [EColors.GREEN]: [
        {
            player: EColors.GREEN,
            roles: getDefaultRoles(EColors.GREEN),
            position: {row: 7, col: 7}
        },
        {
            player: EColors.GREEN,
            roles: getDefaultRoles(EColors.YELLOW),
            position: {row: 6, col: 7}
        },
        {
            player: EColors.GREEN,
            roles: getDefaultRoles(EColors.BLUE),
            position: {row: 5, col: 7}
        },
        {
            player: EColors.GREEN,
            roles: getDefaultRoles(EColors.RED),
            position: {row: 4, col: 7}
        },
    ],
    [EColors.YELLOW]: [
        {
            player: EColors.YELLOW,
            roles: getDefaultRoles(EColors.YELLOW),
            position: {row: 0, col: 7}
        },
        {
            player: EColors.YELLOW,
            roles: getDefaultRoles(EColors.BLUE),
            position: {row: 0, col: 6}
        },
        {
            player: EColors.YELLOW,
            roles: getDefaultRoles(EColors.RED),
            position: {row: 0, col: 5}
        },
        {
            player: EColors.YELLOW,
            roles: getDefaultRoles(EColors.GREEN),
            position: {row: 0, col: 4}
        },
    ],
    [EColors.BLUE]: [
        {
            player: EColors.BLUE,
            roles: getDefaultRoles(EColors.BLUE),
            position: {row: 0, col: 0}
        },
        {
            player: EColors.BLUE,
            roles: getDefaultRoles(EColors.RED),
            position: {row: 1, col: 0}
        },
        {
            player: EColors.BLUE,
            roles: getDefaultRoles(EColors.GREEN),
            position: {row: 2, col: 0}
        },
        {
            player: EColors.BLUE,
            roles: getDefaultRoles(EColors.YELLOW),
            position: {row: 3, col: 0}
        },
    ],
}
function getDefaultMeeples(player :EColors) :IMeeple[] {
    return DEFAULT_MEEPLES[player]
}

function knightMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IMove[] {
    let currentPos :IPosition = allMeeples[meeple].position

    let offsets :IPosition[] = [
        {row: 2, col: 1}, {row: 1, col: 2},
        {row:-2, col: 1}, {row:-1, col: 2},
        {row: 2, col:-1}, {row: 1, col:-2},
        {row:-2, col:-1}, {row:-1, col:-2},
    ]

    let positions = offsets.map(offset => {
        return {
            row: currentPos.row + offset.row,
            col: currentPos.col + offset.col
        }
    })

    let result = positions.map(position => {
        return {...position, moveType: getMoveType(position, limits, allMeeples, meeple)}
    })

    // only return move if it is not INVALID
    return result.filter(move => {
        return move.moveType
    })
}

function bishopMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IMove[] {    
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 1,-1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1,-1, limits, allMeeples, meeple),
    ]
}

function rookMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IMove[] {
    let startingPos = allMeeples[meeple].position
    return [
        ...moveGenerator(startingPos, 1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos,-1, 0, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0, 1, limits, allMeeples, meeple),
        ...moveGenerator(startingPos, 0,-1, limits, allMeeples, meeple),
    ]
}

function getMoveType(move :IPosition, limits :ILimits, allMeeples :IMeeple[], meeple :number) :EMoveType {
    let meepleToMove  = allMeeples[meeple]
    let meepleOnField = allMeeples[getIOfMeepleAtPosition(move, allMeeples)]

    if (!isWithinLimits(move, limits))
        return EMoveType.INVALID

    if (!meepleOnField)
        return EMoveType.NORMAL

    if (meepleOnField.player !== meepleToMove.player)
        return EMoveType.BEATING

    return EMoveType.INVALID
}

function moveGenerator(startingPos :IPosition, rowOffset :number, colOffset :number,
    limits :ILimits, allMeeples :IMeeple[], meeple :number) :IMove[] 
{
    let result :IMove[] = []
    let tmpPos :IPosition = {...startingPos}

    while (true) {
        tmpPos.row += rowOffset
        tmpPos.col += colOffset
        let moveType = getMoveType(tmpPos, limits, allMeeples, meeple)

        // don't add move if it's invalid
        if (moveType !== EMoveType.INVALID)
            result.push({...tmpPos, moveType})

        // stop generator if invalid or beating was encountered
        if (moveType !== EMoveType.NORMAL)
            break;
    }

    return result
}