import {Direction} from "../constants/Direction";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {PyramidRepository} from "../../external/db/PyramidRepository";

export abstract class ExitStrategy {

  protected constructor(private readonly binance: BinanceCommunicator,
                        protected readonly ticker: string,
                        protected readonly amount: number
  ) {
  }

  protected abstract getDirection(): Direction

  protected abstract getSignal(currentPrice: number, signal: TurtleSignal): boolean

  abstract clearPyramid(currentPrice: number, entryPrice: number, pyramidRepository: PyramidRepository): Promise<void>

  async run(currentPrice: number, signal: TurtleSignal) {
    if (this.getSignal(currentPrice, signal)) {
      await this.binance.closePosition(this.ticker, this.getDirection(), this.amount)
    }
  }
}