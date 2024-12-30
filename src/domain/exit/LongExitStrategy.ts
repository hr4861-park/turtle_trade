import {Direction} from "../constants/Direction";
import {ExitStrategy} from "./ExitStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {TurtleSignal} from "../TurtleSignal";
import {LastTradeRepository} from "../../external/db/LastTradeRepository";

export class LongExitStrategy extends ExitStrategy {
  protected async afterClose(currentPrice: number): Promise<void> {
    if (this.entryPrice < currentPrice) {
      await this.repository.create(this.ticker, Direction.LONG)
    }
  }

  protected getSignal(currentPrice: number, signal: TurtleSignal): boolean {
    return currentPrice < signal.low10;
  }

  constructor(binance: BinanceCommunicator,
              private readonly repository: LastTradeRepository,
              ticker: string,
              amount: number,
              private readonly entryPrice: number) {
    super(binance, ticker, amount);
  }

  getDirection(): Direction {
    return Direction.LONG
  }

}