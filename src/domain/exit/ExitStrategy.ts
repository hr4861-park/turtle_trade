import {Direction} from "../constants/Direction";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";

export abstract class ExitStrategy {

  protected constructor(private readonly binance: BinanceCommunicator,
                        protected readonly ticker: string,
                        protected readonly amount: number) {
  }

  protected abstract getDirection(): Direction

  protected abstract getSignal(currentPrice: number, signal: TurtleSignal): boolean

  protected abstract afterClose(currentPrice: number): Promise<void>

  async run(currentPrice: number, signal: TurtleSignal) {
    if (this.getSignal(currentPrice, signal)) {
      await this.binance.closePosition(this.ticker, this.getDirection(), this.amount)
      await this.afterClose(currentPrice)
      return true
    }
    return false
  }

  async forceClose(currentPrice: number) {
    await this.binance.closePosition(this.ticker, this.getDirection(), this.amount)
    await this.afterClose(currentPrice)
  }

}