import { isNumber } from "../lib/hd-helper";

// -----------------------------------------------------------------------------

export enum EColor { RED, GREEN, YELLOW, BLUE }

export function isColor(color: any): color is EColor {
    return isNumber(color) && EColor[color] !== undefined;
}