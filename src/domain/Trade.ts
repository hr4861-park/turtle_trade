import {Direction} from "./constants/Direction";

export interface Trade {
  ticker: string,
  direction: Direction,
  entryPosition: number,
  atr: number,
  stopLoss: number,
  leverage: number
  amount: number
}