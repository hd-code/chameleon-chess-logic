/**
 * @typedef {Object} IGameState
 * @property {ILimits} limits
 * @property {IMeeple[]} meeples
 * @property {number} whoseTurn
 */
export interface IGameState {
    limits: ILimits
    meeples: IMeeple[]
    whoseTurn: EColors
}

export interface ILimits {
    lower: IPosition
    upper: IPosition
}

export interface IPosition {
    row: number
    col: number
}

export interface IMove extends IPosition {
    moveType: EMoveType
}

export enum EMoveType { INVALID, NORMAL, BEATING }

export interface IMeeple {
    player: EColors
    knightColor: EColors
    position: IPosition
}

export enum EColors { RED, GREEN, YELLOW, BLUE }

export enum ERoles { KNIGHT, QUEEN, BISHOP, ROOK }