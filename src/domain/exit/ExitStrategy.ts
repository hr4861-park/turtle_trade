import {Direction} from "../constants/Direction";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {Position} from "../Position";

export abstract class ExitStrategy {

  protected constructor(private readonly binance: BinanceCommunicator,
                        protected readonly position: Position,
                        protected readonly signal: TurtleSignal,
                        protected readonly price: number) {
  }

  protected abstract getDirection(): Direction

  abstract isProfit(): boolean


  async run() {
    await this.binance.closePosition(this.position.ticker, this.getDirection(), this.position.amount)
    return this.isProfit()
  }

  async forceClose() {
    await this.binance.closePosition(this.position.ticker, this.getDirection(), this.position.amount)
    return this.isProfit()
  }

}