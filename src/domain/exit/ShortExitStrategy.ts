import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {LastTradeRepository} from "../../external/db/LastTradeRepository";

export class ShortExitStrategy extends ExitStrategy {
  protected async afterClose(currentPrice: number): Promise<void> {
    if (currentPrice < this.entryPrice) {
      await this.repository.create(this.ticker, Direction.SHORT)
    }
  }

  protected getSignal(currentPrice: number, signal: TurtleSignal): boolean {
    return currentPrice > signal.high10 || signal.value_change > 0
  }

  constructor(binance: BinanceCommunicator,
              private readonly repository: LastTradeRepository,
              ticker: string,
              amount: number,
              private readonly entryPrice: number) {
    super(binance, ticker, amount);
  }

  getDirection(): Direction {
    return Direction.SHORT
  }

}