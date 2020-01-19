const ccl = require('../build/main');
const fs = require('fs');

let log = [];

try {
    let gs = ccl.initGame(true, false, true, true)
    while (!ccl.isGameOver(gs)) {
        log.push(gs);
        console.log('valid:', ccl.isValidGameState(gs));
        console.log('Pawns:', gs.pawns.length, 'Turn:', gs.whoseTurn);
        gs = ccl.letComputerAdvanceGame(gs);
    }
} catch (e) {
    console.log(e);
} finally {
    // fs.writeFileSync('log.json', JSON.stringify(log));
}