import { isNumber } from "../../lib/hd-helper";

// -----------------------------------------------------------------------------

/**
 * Enum for the four colors (RED, GREEN, YELLOW, BLUE). This enum is used for
 * field colors on the board and to discern between the four different players.
 * @enum {number}
 */
export enum EColor { RED, GREEN, YELLOW, BLUE }

export function isColor(color: any): color is EColor {
    return isNumber(color) && EColor[color] !== undefined;
}