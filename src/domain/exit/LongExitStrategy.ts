import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {PyramidRepository} from "../../external/db/PyramidRepository";

export class LongExitStrategy extends ExitStrategy {
  async clearPyramid(currentPrice: number, entryPrice: number, pyramidRepository: PyramidRepository) {
    if (currentPrice < entryPrice) {
      await pyramidRepository.delete(this.ticker)
    }
  }

  protected getSignal(currentPrice: number, signal: TurtleSignal): boolean {
    return currentPrice < signal.low10;
  }

  constructor(binance: BinanceCommunicator, ticker: string, amount: number) {
    super(binance, ticker, amount);
  }

  getDirection(): Direction {
    return Direction.LONG
  }

}