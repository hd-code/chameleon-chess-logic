import { EColors, IPosition, ERoles } from "./basic";
import { ILimits, isWithinLimits } from "./limits";

/* --------------------------------- Public --------------------------------- */

export interface IMeeple {
    player: EColors
    knightColor: EColors
    position: IPosition
}

/** usage: MEEPLES_STARTING_GRID[ playerColor ] 
 * returns: all meeples for that player 
 */
export const MEEPLES_STARTING_GRID :IMeeple[][] = [
    // RED:
    [
        {player: EColors.RED, knightColor: EColors.RED,    position: {row: 7, col: 0}},
        {player: EColors.RED, knightColor: EColors.GREEN,  position: {row: 7, col: 1}},
        {player: EColors.RED, knightColor: EColors.YELLOW, position: {row: 7, col: 2}},
        {player: EColors.RED, knightColor: EColors.BLUE,   position: {row: 7, col: 3}},
    ],
    // GREEN:
    [
        {player: EColors.GREEN, knightColor: EColors.GREEN,  position: {row: 7, col: 7}},
        {player: EColors.GREEN, knightColor: EColors.YELLOW, position: {row: 6, col: 7}},
        {player: EColors.GREEN, knightColor: EColors.BLUE,   position: {row: 5, col: 7}},
        {player: EColors.GREEN, knightColor: EColors.RED,    position: {row: 4, col: 7}},
    ],
    // YELLOW:
    [
        {player: EColors.YELLOW, knightColor: EColors.YELLOW, position: {row: 0, col: 7}},
        {player: EColors.YELLOW, knightColor: EColors.BLUE,   position: {row: 0, col: 6}},
        {player: EColors.YELLOW, knightColor: EColors.RED,    position: {row: 0, col: 5}},
        {player: EColors.YELLOW, knightColor: EColors.GREEN,  position: {row: 0, col: 4}},
    ],
    // BLUE:
    [
        {player: EColors.BLUE, knightColor: EColors.BLUE,   position: {row: 0, col: 0}},
        {player: EColors.BLUE, knightColor: EColors.RED,    position: {row: 1, col: 0}},
        {player: EColors.BLUE, knightColor: EColors.GREEN,  position: {row: 2, col: 0}},
        {player: EColors.BLUE, knightColor: EColors.YELLOW, position: {row: 3, col: 0}},
    ],
]

export enum EMoveType { INVALID, NORMAL, BEATING }

export interface IMove extends IPosition {
    moveType: EMoveType
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
    }
}

export function findMeepleAtPosition(position :IPosition, allMeeples :IMeeple[]) :IMeeple|null {
    for (let i = 0, ie = allMeeples.length; i < ie; i++) {
        if (   position.row === allMeeples[i].position.row
            && position.col === allMeeples[i].position.col)
                return allMeeples[i]
    }
    return null
}

/* --------------------------------- Intern --------------------------------- */

// usage: KNIGHT_COLOR_COLOR_ROLE_MAP[ knightColor ] [ fieldColor ]
//          result -> ERole
const KNIGHT_COLOR_COLOR_ROLE_MAP :ERoles[][] = [
    // RED:
    [ ERoles.KNIGHT, ERoles.QUEEN, ERoles.BISHOP, ERoles.ROOK ],
    // GREEN:
    [ ERoles.ROOK, ERoles.KNIGHT, ERoles.QUEEN, ERoles.BISHOP ],
    // YELLOW:
    [ ERoles.BISHOP, ERoles.ROOK, ERoles.KNIGHT, ERoles.QUEEN ],
    // BLUE:
    [ ERoles.QUEEN, ERoles.BISHOP, ERoles.ROOK, ERoles.KNIGHT ]
]
function getCurrentRole(meeple :IMeeple, board :EColors[][]) :ERoles {
    let fieldColor = board[meeple.position.row][meeple.position.col]
    return KNIGHT_COLOR_COLOR_ROLE_MAP[meeple.knightColor][fieldColor]
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
    let result :IMove[] = []
    
    let startingPos = allMeeples[meeple].position
    result.concat( moveGenerator(startingPos, 1, 1, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos,-1, 1, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos, 1,-1, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos,-1,-1, limits, allMeeples, meeple) )

    return result
}

function rookMoves(meeple :number, allMeeples :IMeeple[], limits :ILimits) :IMove[] {
    let result :IMove[] = []
    
    let startingPos = allMeeples[meeple].position
    result.concat( moveGenerator(startingPos, 1, 0, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos,-1, 0, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos, 0, 1, limits, allMeeples, meeple) )
    result.concat( moveGenerator(startingPos, 0,-1, limits, allMeeples, meeple) )

    return result
}

function getMoveType(move :IPosition, limits :ILimits, allMeeples :IMeeple[], meeple :number) :EMoveType {
    let meepleToMove  = allMeeples[meeple]
    let meepleOnField = findMeepleAtPosition(move, allMeeples)

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