import {singleton} from "tsyringe";
import {ExitStrategy} from "../domain/exit/ExitStrategy";
import {Position} from "../domain/Position";
import {Direction} from "../domain/constants/Direction";
import {LongExitStrategy} from "../domain/exit/LongExitStrategy";
import {ShortExitStrategy} from "../domain/exit/ShortExitStrategy";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {LastTradeRepository} from "../external/db/LastTradeRepository";

@singleton()
export class ExitStrategyFactory {

  constructor(private readonly binance: BinanceCommunicator,
              private readonly repository: LastTradeRepository) {
  }

  createStrategy({direction, ticker, amount, entryPrice}: Position): ExitStrategy | undefined {
    if (direction === Direction.LONG) {
      return new LongExitStrategy(this.binance, this.repository, ticker, amount, entryPrice);
    } else if (direction === Direction.SHORT) {
      return new ShortExitStrategy(this.binance, this.repository, ticker, amount, entryPrice);
    }
    return undefined

  }
}