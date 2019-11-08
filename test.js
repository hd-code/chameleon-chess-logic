const ccl = require('./build/main');


let gs = ccl.initGame({0: true, 1: true, 2: true, 3: true})
// gs = ccl.letAIadvanceGame(gs)
do {
    console.log('Pawns:', gs.pawns.length, 'Turn:', gs.whoseTurn);
    gs = ccl.letComputerAdvanceGame(gs)
} while(!ccl.isGameOver(gs))