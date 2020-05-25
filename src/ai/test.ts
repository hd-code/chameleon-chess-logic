import { makeComputerMove } from "./";
import { beginGame } from "..";
import { IGameState } from "../types";

// -----------------------------------------------------------------------------

const gameState = beginGame(true, false, true, false);

if (gameState !== null) {
    test(gameState);
    // test(gameState);
}

async function test(gameState: IGameState) {
    try {
        const nextGS = await makeComputerMove(gameState);
        console.log(nextGS.player);
    }
    catch (e) {
        console.log(e);
    }
}