const assert = require('assert')
const ccl = require('../build/main')
const basic = require('../build/basic')
const lim = require('../build/limits')


// export function advanceGame(destination :IPosition, meeple :number, gs :GS.IGameState) 
//          :GS.IGameState|null
describe('Test advanceGame()', () => {
    let gs = {
        limits: lim.STARTING_LIMITS,
        meeples: [
            {player: basic.EColors.RED,    knightColor: basic.EColors.RED,    position: {row: 7, col: 0}},
            {player: basic.EColors.YELLOW, knightColor: basic.EColors.BLUE, position: {row: 0, col: 7}},
            {player: basic.EColors.YELLOW, knightColor: basic.EColors.YELLOW, position: {row: 0, col: 6}},
            {player: basic.EColors.YELLOW, knightColor: basic.EColors.RED, position: {row: 1, col: 3}},
        ],
        whoseTurn: basic.EColors.YELLOW
    }

    const moves = [
        {meeple: 3, destination: {row: 1, col: 1}}, // rook -> queen, nothing else
        {meeple: 0, destination: {row: 5, col: 1}}, // knight -> queen, field shrinks
        {meeple: 1, destination: {row: 3, col: 7}}, // rook -> bishop, no shrinking
        {meeple: 0, destination: {row: 1, col: 1}}, // queen -> queen, shrinking
        {meeple: 2, destination: {row: 0, col: 1}}, // rook -> biknightshop, no shrinking
        {meeple: 0, destination: {row: 0, col: 1}}, // queen -> knight, no shrinking, beating
        {meeple: 1, destination: {row: 0, col: 4}}, // bishop -> bishop, shrinking to smallest row
        {meeple: 0, destination: {row: 1, col: 3}}, // knight -> rook, shrinking to smallest col
        {meeple: 1, destination: {row: 1, col: 3}}, // bishop -> knight, beating and winning and unable to move
    ]
    const newLimits = [
        {lower: {row: 0, col: 1}, upper: {row: 5, col: 7}},
        {lower: {row: 0, col: 1}, upper: {row: 5, col: 7}},
        {lower: {row: 0, col: 1}, upper: {row: 5, col: 7}},
        {lower: {row: 0, col: 1}, upper: {row: 3, col: 7}},
        {lower: {row: 0, col: 1}, upper: {row: 3, col: 7}},
        {lower: {row: 0, col: 1}, upper: {row: 2, col: 4}},
        {lower: {row: 0, col: 1}, upper: {row: 2, col: 4}},
        {lower: {row: 0, col: 2}, upper: {row: 2, col: 4}},
        {lower: {row: 0, col: 2}, upper: {row: 2, col: 4}},
    ]

    moves.forEach(move => {
        gs = ccl.advanceGame(move.destination, move.meeple, gs)
        console.log(gs)
        assert.notEqual(gs, null)
    })
})