const ccl = require('./build/main');


let gs = ccl.initGame({0: true, 1: true, 2: true, 3: true})
// gs = ccl.letAIadvanceGame(gs)
do {
    console.log('Meeples:', gs.meeples.length, 'Turn:', gs.whoseTurn);
    gs = ccl.letAIadvanceGame(gs)
} while(!ccl.isGameOver(gs))