import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {Position} from "../Position";

export class LongExitStrategy extends ExitStrategy {
  isProfit(): boolean {
    return super.price > super.position.entryPrice
  }

  constructor(binance: BinanceCommunicator,
              position: Position,
              signal: TurtleSignal,
              price: number) {
    super(binance, position, signal, price);
  }

  getDirection(): Direction {
    return Direction.LONG
  }

}