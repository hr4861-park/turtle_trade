import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {Position} from "../Position";
import {TurtleSignal} from "../TurtleSignal";


export class ShortExitStrategy extends ExitStrategy {
  isProfit(): boolean {
    return super.price < super.position.entryPrice
  }

  constructor(binance: BinanceCommunicator,
              position: Position,
              signal: TurtleSignal,
              price: number) {
    super(binance, position, signal, price);
  }

  getDirection(): Direction {
    return Direction.SHORT
  }

}