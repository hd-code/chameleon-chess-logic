import { IGameState, advanceGame, isGameStillOn } from "./gameState";
import { IPosition, BOARD } from "./basic";
import { nextMoves, findMeepleAtPosition, MEEPLES_STARTING_GRID } from "./meeples";
import { STARTING_LIMITS } from "./limits";

export class Game {

    constructor() {
        this.gameState = {limits: STARTING_LIMITS, meeples: MEEPLES_STARTING_GRID[0], whoseTurn: 0}
        this.selectedMeeple = -1
        this.nextMoves = []
    }

    init(numOfPlayers :number) {

    }

    play(clickPos :IPosition) :IGameState|null {
        let newGameState = advanceGame(clickPos, this.selectedMeeple, this.gameState)

        if (newGameState === null) {
            let meeple = findMeepleAtPosition(clickPos, this.gameState.meeples)

            if (!meeple) {
                this.unselectMeeple()
            } else {
                let meepleIndex = this.gameState.meeples.indexOf(meeple)
                this.selectMeeple(meepleIndex)
            }

            return null
        }

        this.unselectMeeple()
        this.gameState = newGameState
        return newGameState
    }

    isGameRunning() :boolean { return isGameStillOn(this.gameState) }

    getGameState() :IGameState { return this.gameState }
    getSelectedMeeple() :number { return this.selectedMeeple }
    getNextMoves() :IPosition[] { return this.nextMoves }

    // private: ----------------------------------------------------------------

    private gameState :IGameState
    private selectedMeeple :number
    private nextMoves :IPosition[]

    private selectMeeple(meepleIndex :number) :void {
        this.selectedMeeple = meepleIndex
        this.nextMoves = nextMoves(meepleIndex, this.gameState.meeples, this.gameState.limits, BOARD)
    }

    private unselectMeeple() :void {
        this.selectedMeeple = -1
        this.nextMoves = []
    }
}