import {singleton} from "tsyringe";
import {ExitStrategy} from "../domain/exit/ExitStrategy";
import {Position} from "../domain/Position";
import {Direction} from "../domain/constants/Direction";
import {LongExitStrategy} from "../domain/exit/LongExitStrategy";
import {ShortExitStrategy} from "../domain/exit/ShortExitStrategy";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

@singleton()
export class ExitStrategyFactory {

  constructor(private readonly binance: BinanceCommunicator) {
  }

  createStrategy({direction, ticker, amount}: Position): ExitStrategy | undefined {
    if (direction === Direction.LONG) {
      return new LongExitStrategy(this.binance, ticker, amount);
    } else if (direction === Direction.SHORT) {
      return new ShortExitStrategy(this.binance, ticker, amount);
    }
    return undefined

  }
}