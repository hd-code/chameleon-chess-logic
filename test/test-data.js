const helper = require('../lib/hd-helper');

let public = {};

// -----------------------------------------------------------------------------

const START_LIMITS = { lower:{row:0,col:0}, upper:{row:7,col:7} };

// ------------------------- Test Moves for all Roles --------------------------

const BLUE_PAWNS_ALL_ROLES = [
    { player: 3, roles:{ 0:0, 1:1, 2:2, 3:3 }, position: { row:6, col:5 } }, // BISHOP
    { player: 3, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:4, col:6 } }, // Knight
    { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:3, col:2 } }, // ROOK
    { player: 3, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:3, col:5 } }, // QUEEN
];

const PAWNS_FOR_BEATING = [
    { player: 0, roles:{ 0:0, 1:1, 2:2, 3:3 }, position: { row:5, col:6 } },
    { player: 0, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:2, col:5 } },
    { player: 1, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:1, col:2 } },
];

const CORNER_PAWNS = [
    { player: 2, roles:{ 0:0, 1:1, 2:2, 3:3 }, position: { row:7, col:0 } },
    { player: 2, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:7, col:7 } },
    { player: 2, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:0, col:7 } },
    { player: 2, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:0, col:0 } },
];

public.testMovesOfRoles = {
    game: {
        limits: START_LIMITS,
        pawns: [
            ...BLUE_PAWNS_ALL_ROLES,
            ...PAWNS_FOR_BEATING,
            ...CORNER_PAWNS
        ],
        whoseTurn: 3
    },
    numOfPawnsPerPlayer: { 0:2, 1:1, 2:4, 3:4 },
    arePlayersAlive: { 0:true, 1:true, 2:true, 3:true },

    pawnIKnight: 1,
    validKnightMoves: [
        // { row:4+1, col:6+2 }, // out of limits
        // { row:4-1, col:6+2 }, // out of limits
        { row:4+1, col:6-2 },
        { row:4-1, col:6-2 }, // beating move
        { row:4+2, col:6+1 },
        // { row:4+2, col:6-1 }, // own pawn on field
        { row:4-2, col:6+1 },
        { row:4-2, col:6-1 },
    ],

    pawnIBishop: 0,
    validBishopMoves: [
        { row:6+1, col:5+1 },
        // { row:6+2, col:5+2 }, // out of limits

        { row:6-1, col:5+1 }, // beating
        // { row:6-2, col:5+2 }, // can't move over other pawn

        { row:6+1, col:5-1 },
        // { row:6+2, col:5-2 }, // out of limits

        { row:6-1, col:5-1 },
        { row:6-2, col:5-2 },
        // { row:6-3, col:5-3 }, // own pawn
        // { row:6-4, col:5-4 }, // can't move over other pawn
    ],

    pawnIRook: 2,
    validRookMoves: [
        { row:3+1, col:2 },
        { row:3+2, col:2 },
        { row:3+3, col:2 },
        { row:3+4, col:2 },
        // { row:3+5, col:2 }, // out of limits

        { row:3-1, col:2 },
        { row:3-2, col:2 }, // beating
        // { row:3-3, col:2 }, // can't move over other pawn


        { row:3, col:2+1 },
        { row:3, col:2+2 },
        // { row:3, col:2+3 }, // own pawn
        // { row:3, col:2+4 }, // can't move over other pawn'

        { row:3, col:2-1 },
        { row:3, col:2-2 },
        // { row:3, col:2-3 }, // out of limits
    ],

    pawnIQueen: 3,
    validQueenMoves: [
        { row:3, col:5+1 },
        { row:3, col:5+2 },
        // { row:3, col:5+3 }, // out of limits

        { row:3, col:5-1 },
        { row:3, col:5-2 },
        // { row:3, col:5-3 }, // own pawn
        // { row:3, col:5-4 }, // can't move over other pawn'

        { row:3+1, col:5 },
        { row:3+2, col:5 },
        // { row:3+3, col:5 }, // own pawn
        // { row:3+4, col:5 }, // can't move over other pawn

        { row:3-1, col:5 }, // beating
        // { row:3-2, col:5 }, // can't move over other pawn

        // { row:3+1, col:5+1 }, // own pawn
        // { row:3+2, col:5+2 }, // can't move over other pawn

        { row:3-1, col:5+1 },
        { row:3-2, col:5+2 },
        // { row:3-3, col:5+3 }, // out of limits

        { row:3+1, col:5-1 },
        { row:3+2, col:5-2 },
        { row:3+3, col:5-3 },
        { row:3+4, col:5-4 },
        // { row:3+5, col:5-5 }, // out of limits

        { row:3-1, col:5-1 },
        { row:3-2, col:5-2 },
        { row:3-3, col:5-3 },
        // { row:3-4, col:5-4 }, // out of limits
    ],

    invalidMovesForAll: [
        {row:1, col:4}, // unreachable for blue pawns
        {row:6, col:1}, // unreachable for blue pawns
        {row:4, col:7}, // unreachable for blue pawns
        {row:0, col:0}, // unreachable for blue pawns
        {row:7, col:7}, // unreachable for blue pawns

        {row:0, col:8}, // out of limits
        {row:-3, col:2}, // out of limits

        {row:0.5, col:3.6}, // invalid numbers
    ]
};

// -------------------------- Test Shrinking of Board --------------------------

public.testShrinkingOfBoard = {
    game: {
        limits: START_LIMITS,
        pawns: [
            { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
            { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:7 } }, // QUEEN
            { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
        ],
        whoseTurn: 1
    },
    numOfPawnsPerPlayer: { 0:0, 1:2, 2:0, 3:1 },
    arePlayersAlive: { 0:false, 1:true, 2:false, 3:true },

    shrinkColsRight: {
        move: { pawnI: 1, destination:{row:0, col:4} },
        game: {
            limits: { lower:{row:0,col:0}, upper:{row:7,col:4} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:4 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },
    shrinkColsRightToSmallest: {
        move: { pawnI: 1, destination:{row:0, col:0} },
        game: {
            limits: { lower:{row:0,col:0}, upper:{row:7,col:2} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:0 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },

    shrinkRowsTop: {
        move: { pawnI: 1, destination:{row:3, col:7} },
        game: {
            limits: { lower:{row:3,col:0}, upper:{row:7,col:7} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:7 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },
    shrinkRowsTopToSmallest: {
        move: { pawnI: 1, destination:{row:7, col:7} },
        game: {
            limits: { lower:{row:5,col:0}, upper:{row:7,col:7} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:7, col:7 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },

    shrinkRowsAndColsTopRight: {
        move: { pawnI: 1, destination:{row:3, col:4} },
        game: {
            limits: { lower:{row:3,col:0}, upper:{row:7,col:4} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:4 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },
    shrinkRowsAndColsTopRightToSmallest: {
        move: { pawnI: 1, destination:{row:6, col:1} },
        game: {
            limits: { lower:{row:5,col:0}, upper:{row:7,col:2} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:6, col:1 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:0 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },

    noShrinking: {
        move: { pawnI: 2, destination:{row:7,col:7} },
        game: {
            limits: START_LIMITS,
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:7 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:7, col:7 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },

    shrinkingOtherPawnsSetLimits: {
        move: { pawnI: 2, destination:{row:4, col:3} },
        game: {
            limits: { lower:{row:0,col:0}, upper:{row:6,col:7} },
            pawns: [
                { player: 3, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:6, col:0 } }, // ROOK
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:7 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:4, col:3 } }, // QUEEN
            ],
            whoseTurn: 3
        },
    },

    shrinkingBeatingWinning: {
        move: { pawnI: 2, destination:{row:6, col:0} },
        game: {
            limits: { lower:{row:0,col:0}, upper:{row:6,col:7} },
            pawns: [
                { player: 1, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:0, col:7 } }, // QUEEN
                { player: 1, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:6, col:0 } }, // QUEEN
            ],
            whoseTurn: 1
        },
    },
}

// ---------------------------- Test advanced moves ----------------------------

public.testAdvancedMoves = {
    game: {
        limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
        pawns: [
            {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:2, col: 1 } },
            {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 1 } },
            {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: { row:6, col: 3 } },
            {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
        ],
        whoseTurn: 0
    },
    numOfPawnsPerPlayer: { 0:2, 1:0, 2:2, 3:0 },
    arePlayersAlive: { 0:true, 1:false, 2:true, 3:false },

    normalMove: {
        move: { pawnI: 0, destination: { row: 2, col: 3 } },
        game: {
            limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
            pawns: [
                {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:2, col: 3 } },
                {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 1 } },
                {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: { row:6, col: 3 } },
                {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
            ],
            whoseTurn: 2
        },
    },

    shrinking: {
        move: { pawnI: 0, destination: { row: 3, col: 1 } },
        game: {
            limits: { lower:{row:3,col:1}, upper:{row:6,col:5} },
            pawns: [
                {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:3, col: 1 } },
                {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 1 } },
                {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: { row:6, col: 3 } },
                {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
            ],
            whoseTurn: 2
        },
    },

    shrinkingToSmallestRow: {
        move: { pawnI: 0, destination: { row: 5, col: 1 } },
        game: {
            limits: { lower:{row:4,col:1}, upper:{row:6,col:5} },
            pawns: [
                {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:5, col: 1 } },
                {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 1 } },
                {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: { row:6, col: 3 } },
                {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
            ],
            whoseTurn: 2
        },
    },

    beating: {
        move: { pawnI: 1, destination: { row: 6, col: 3 } },
        game: {
            limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
            pawns: [
                {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:2, col: 1 } },
                {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 3 } },
                {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
            ],
            whoseTurn: 2
        },
    },

    beatingAndShrinking: {
        move: { pawnI: 0, destination: { row: 6, col: 5 } },
        game: {
            limits: { lower:{row:4,col:1}, upper:{row:6,col:5} },
            pawns: [
                {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: { row:6, col: 5 } },
                {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: { row:6, col: 1 } },
                {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: { row:6, col: 3 } },
            ],
            whoseTurn: 2
        },
    },

    invalidMoves: [
        { pawnI: 0, destination: { row: 3, col: 3 } }, // not reachable
        { pawnI: 1, destination: { row: 3, col: 3 } }, // not reachable
        { pawnI: 0, destination: { row: 0, col: 1 } }, // out of limits
        { pawnI: 1, destination: { row: 6, col: 0 } }, // out of limits
        { pawnI: 0, destination: { row: 6, col: 1 } }, // own pawn
        { pawnI: 1, destination: { row: 2, col: 1 } }, // own pawn
        { pawnI: 2, destination: { row: 4, col: 2 } }, // not on turn
        { pawnI: 3, destination: { row: 6, col: 4 } }, // not on turn
        { pawnI: 4, destination: { row: 3, col: 3 } }, // pawn does not exist
        { pawnI: 5, destination: { row: 3, col: 3 } }, // pawn does not exist
    ],
};

// ----------------------------- Test Special Case -----------------------------

public.testSpecialCase = {
    game: {
        limits: { lower:{row:2,col:0}, upper:{row:4,col:5} },
        pawns: [
            { player: 0, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:4 } }, // Knight !
            { player: 0, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:4, col:3 } }, // Queen
            { player: 2, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:2, col:5 } }, // Knight
            { player: 2, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:0 } }, // Queen, becomes Knight !
        ],
        whoseTurn: 2
    },
    numOfPawnsPerPlayer: { 0:2, 1:0, 2:2, 3:0 },
    arePlayersAlive: { 0:true, 1:false, 2:true, 3:false },

    beatingAndBeingRemoved: {
        move: { pawnI: 3, destination: { row:3, col:4 } },
        numOfPawnsPerPlayer: { 0:1, 1:0, 2:1, 3:0 },
        numOfPawns: 2,
        game: {
            limits: { lower:{row:2,col:3}, upper:{row:4,col:5} },
            pawns: [
                { player: 0, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:4, col:3 } }, // Queen
                { player: 2, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:2, col:5 } }, // Knight
            ],
            whoseTurn: 0
        },
    },

    creatingSmallestBoardRemoveTrappedPawn: {
        move: { pawnI: 3, destination: { row:3, col:3 } },
        numOfPawnsPerPlayer: { 0:1, 1:0, 2:2, 3:0 },
        numOfPawns: 3,
        game: {
            limits: { lower:{row:2,col:3}, upper:{row:4,col:5} },
            pawns: [
                { player: 0, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:4, col:3 } }, // Queen
                { player: 2, roles:{ 0:1, 1:2, 2:3, 3:0 }, position: { row:2, col:5 } }, // Knight
                { player: 2, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:3 } }, // Queen, becomes Knight !
            ],
            whoseTurn: 0
        },
    }
};

public.testSpecialCaseWinning = {
    game: {
        limits: { lower:{row:2,col:4}, upper:{row:4,col:6} },
        pawns: [
            { player: 0, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:4, col:4 } }, // Bishop, becomes knight !
            { player: 3, roles:{ 0:3, 1:0, 2:1, 3:2 }, position: { row:3, col:5 } }, // Queen
        ],
        whoseTurn: 0
    },
    numOfPawnsPerPlayer: { 0:1, 1:0, 2:0, 3:1 },
    arePlayersAlive: { 0:true, 1:false, 2:false, 3:true },

    beatingBeingTrappedButWinning: {
        move: { pawnI: 0, destination:{row:3, col:5} },
        numOfPawnsPerPlayer: { 0:1, 1:0, 2:0, 3:0 },
        numOfPawns: 1,
        game: {
            limits: { lower:{row:2,col:4}, upper:{row:4,col:6} },
            pawns: [
                { player: 0, roles:{ 0:2, 1:3, 2:0, 3:1 }, position: { row:3, col:5 } },
            ],
            whoseTurn: 0
        },
    }
};

// ----------------------------- Helper Functions ------------------------------

/**
 * @param {{row: number, col: number}[]} a 
 * @param {{row: number, col: number}[]} b 
 */
function isSameMoves(movesA, movesB) {
    if (movesA.length != movesB.length)
        return false;

    let a = helper.deepClone(movesA), b = helper.deepClone(movesB);

    a.sort(sorting);
    b.sort(sorting);

    for (var i = 0; i < a.length; i++) {
        if (a[i].row !== b[i].row || a[i].col !== b[i].col)
            return false;
    }

    return true;
}

function sorting(a,b) {
    const rowDiff = a.row - b.row;
    return rowDiff === 0 ? a.col - b.col : rowDiff;
}

public.isSameMoves = isSameMoves;

// -----------------------------------------------------------------------------

module.exports = public;