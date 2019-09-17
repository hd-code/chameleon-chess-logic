import { EColors, ERoles } from "./basic";
import { STARTING_LIMITS } from "./limits";
import { IMeeple } from "./meeples";
import { initGame, letComputerAdvanceGame, advanceGame } from "./main";





let gs = {
    limits: STARTING_LIMITS,
    meeples: <IMeeple[]>[
        {
            player: EColors.RED,
            roles: {
                [EColors.RED]:    ERoles.KNIGHT,
                [EColors.GREEN]:  ERoles.QUEEN,
                [EColors.YELLOW]: ERoles.BISHOP,
                [EColors.BLUE]:   ERoles.ROOK
            },
            position: {row: 7, col: 0}
        },
        {
            player: EColors.YELLOW,
            roles: {
                [EColors.RED]:    ERoles.QUEEN,
                [EColors.GREEN]:  ERoles.BISHOP,
                [EColors.YELLOW]: ERoles.ROOK,
                [EColors.BLUE]:   ERoles.KNIGHT
            },
            position: {row: 0, col: 7}
        },
        {
            player: EColors.YELLOW,
            roles: {
                [EColors.RED]:    ERoles.BISHOP,
                [EColors.GREEN]:  ERoles.ROOK,
                [EColors.YELLOW]: ERoles.KNIGHT,
                [EColors.BLUE]:   ERoles.QUEEN
            },
            position: {row: 0, col: 6}
        },
        {
            player: EColors.YELLOW,
            roles: {
                [EColors.RED]:    ERoles.KNIGHT,
                [EColors.GREEN]:  ERoles.QUEEN,
                [EColors.YELLOW]: ERoles.BISHOP,
                [EColors.BLUE]:   ERoles.ROOK
            },
            position: {row: 1, col: 3}
        },
    ],
    whoseTurn: EColors.RED
}

const moves = [
    {meeple: 3, destination: {row: 5, col: 1}}, // rook -> queen, nothing happens
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
    {lower: {row: 0, col: 0}, upper: {row: 7, col: 7}},
    {lower: {row: 0, col: 1}, upper: {row: 5, col: 7}},
    {lower: {row: 0, col: 1}, upper: {row: 5, col: 7}},
    {lower: {row: 0, col: 1}, upper: {row: 3, col: 7}},
    {lower: {row: 0, col: 1}, upper: {row: 3, col: 7}},
    {lower: {row: 0, col: 1}, upper: {row: 2, col: 4}},
    {lower: {row: 0, col: 1}, upper: {row: 2, col: 4}},
    {lower: {row: 0, col: 1}, upper: {row: 2, col: 3}},
    {lower: {row: 0, col: 1}, upper: {row: 2, col: 3}},
]

moves.forEach(move => {
    gs = advanceGame(move.destination, move.meeple, gs) || gs
    console.log(gs)
})



// let gs = initGame(3)

// while (true) {
//     let newGs = letComputerAdvanceGame(gs)
//     if (!newGs)
//         break;
//     gs = newGs
//     // console.log(gs)
// }

// let test = 3


// let testGS = {
//     limits: { lower: { row: 0, col: 0 }, upper: { row: 7, col: 7 } },
//     meeples: [
//         { player: 0, knightColor: 1, position: { row: 7, col: 0 } },
//     ],
//     whoseTurn: 0
//   }

// let print = nextMoves(0, testGS.meeples, testGS.limits, BOARD)
// console.log(print);