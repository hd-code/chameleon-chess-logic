const GS_ADV_STATE = {
    limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
    pawns: [
        {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:2, col: 1} },
        {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: {row:6, col: 1} },
        {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: {row:6, col: 3} },
        {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:6, col: 5} },
    ],
    whoseTurn: 0
};
const GS_ADV_STATE2 = {
    limits: GS_ADV_STATE.limits,
    pawns: GS_ADV_STATE.pawns,
    whoseTurn: 2
};


const advMoves = {
    gs: {
        limits: { lower:{row:2,col:1}, upper:{row:6,col:5} },
        pawns: [
            {player: 0, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:2, col: 1} },
            {player: 0, roles:{ 0:1, 1:2, 2:3, 3:0}, position: {row:6, col: 1} },
            {player: 2, roles:{ 0:0, 1:1, 2:2, 3:3}, position: {row:6, col: 3} },
            {player: 2, roles:{ 0:3, 1:0, 2:1, 3:2}, position: {row:6, col: 5} },
        ],
        whoseTurn: 0
    },
    moves: {
        "normal move, no shrinking": {
            pawnI: 0,
            destination: { row: 2, col: 3 }
        },
        "normal move, with shrinking": {
            pawnI: 0,
            destination: { row: 3, col: 1 }
        },
        "normal move, with shrinking to smallest field": {
            pawnI: 0,
            destination: { row: 5, col: 1 }
        },
        "beating, no shrinking": {
            pawnI: 1,
            destination: { row: 6, col: 3 }
        },
        "beating, with shrinking": {
            pawnI: 0,
            destination: { row: 6, col: 5 }
        },
        "normal move to unreachable position": {
            pawnI: 0,
            destination: { row: 3, col: 3 }
        },
        "normal move to unreachable position2": {
            pawnI: 1,
            destination: { row: 3, col: 3 }
        },
        "beating own pawn": {
            pawnI: 0,
            destination: { row: 6, col: 1 }
        },
        "beating own pawn2": {
            pawnI: 1,
            destination: { row: 2, col: 1 }
        },
    }
}

const simpleMovesKnight = {

    
}