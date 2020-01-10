import { isNumber } from "../helper";

// -----------------------------------------------------------------------------

export enum EColor { RED, GREEN, YELLOW, BLUE }

export function isColor(color: EColor): color is EColor {
    return isNumber(color) && EColor[color] !== undefined
}