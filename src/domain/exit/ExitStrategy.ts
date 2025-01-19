import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {Position} from "../Position";

export abstract class ExitStrategy {

  protected constructor(private readonly binance: BinanceCommunicator,
                        protected readonly position: Position,
                        protected readonly signal: TurtleSignal,
                        protected readonly price: number) {
  }
  abstract isProfit(): boolean


  async run() {
    await this.binance.closePosition(this.position.ticker, this.position.amount)
    return this.isProfit()
  }
}