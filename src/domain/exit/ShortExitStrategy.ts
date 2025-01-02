import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";


export class ShortExitStrategy extends ExitStrategy {

  protected getSignal(currentPrice: number, signal: TurtleSignal): boolean {
    return currentPrice > signal.high10 || signal.value_change > 0
  }

  constructor(binance: BinanceCommunicator,

              ticker: string,
              amount: number,
              private readonly entryPrice: number) {
    super(binance, ticker, amount);
  }

  getDirection(): Direction {
    return Direction.SHORT
  }

}