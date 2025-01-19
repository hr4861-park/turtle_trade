import {singleton} from "tsyringe";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {LastTradeRepository} from "../../external/db/LastTradeRepository";
import {Position} from "../Position";
import {LongPyramidStrategy} from "./LongPyramidStrategy";
import {PyramidStrategy} from "./PyramidStrategy";

@singleton()
export class PyramidFactory {

  private readonly binanceCommunicator: BinanceCommunicator;
  private readonly lastTradeRepository: LastTradeRepository

  constructor(binanceCommunicator: BinanceCommunicator, lastTradeRepository: LastTradeRepository) {
    this.binanceCommunicator = binanceCommunicator;
    this.lastTradeRepository = lastTradeRepository;
  }

  async create(position: Position, currentPrice: number): Promise<PyramidStrategy | null> {
    const lastTrade = await this.lastTradeRepository.select(position.ticker)
    if (!lastTrade) {
      return null
    }
    if (currentPrice > lastTrade.targetPrice) {
      return new LongPyramidStrategy(this.binanceCommunicator, this.lastTradeRepository, position.ticker, lastTrade.atr, currentPrice, position.amount, lastTrade.size)
    }
    return null
  }

}