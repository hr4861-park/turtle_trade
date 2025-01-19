import {singleton} from "tsyringe";
import {ExitStrategy} from "./ExitStrategy";
import {Position} from "../Position";
import {LongExitStrategy} from "./LongExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";

@singleton()
export class ExitStrategyFactory {

  constructor(private readonly binance: BinanceCommunicator) {
  }

  createStrategy(position: Position, signal: TurtleSignal, price: number): ExitStrategy | undefined {
    if (signal.low10 >= price) {
      return new LongExitStrategy(this.binance, position, signal, price);
    }
    return undefined
  }

}