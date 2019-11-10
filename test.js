const ccl = require('./build/main');


let gs = ccl.initGame(true, true, true, true)
do {
    console.log('Pawns:', gs.pawns.length, 'Turn:', gs.whoseTurn);
    gs = ccl.letComputerAdvanceGame(gs)
} while(!ccl.isGameOver(gs))