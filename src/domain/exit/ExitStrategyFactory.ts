import {singleton} from "tsyringe";
import {ExitStrategy} from "./ExitStrategy";
import {Position} from "../Position";
import {Direction} from "../constants/Direction";
import {LongExitStrategy} from "./LongExitStrategy";
import {ShortExitStrategy} from "./ShortExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";

@singleton()
export class ExitStrategyFactory {

  constructor(private readonly binance: BinanceCommunicator) {
  }

  createStrategy(position: Position, signal: TurtleSignal, price: number): ExitStrategy | undefined {
    if (position.direction === Direction.LONG && signal.low10 >= price) {
      return new LongExitStrategy(this.binance, position, signal, price);
    } else if (position.direction === Direction.SHORT && signal.high10 <= price) {
      return new ShortExitStrategy(this.binance, position, signal, price);
    }
    return undefined
  }

}