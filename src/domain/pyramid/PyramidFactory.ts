import {singleton} from "tsyringe";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {LastTradeRepository} from "../../external/db/LastTradeRepository";
import {Position} from "../Position";
import {Direction} from "../constants/Direction";
import {LongPyramidStrategy} from "./LongPyramidStrategy";
import {ShortPyramidStrategy} from "./ShortPyramidStrategy";
import {Pyramid} from "../Pyramid";
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
    if (!lastTrade || lastTrade.direction !== position.direction) {
      return null
    }
    if (position.direction === Direction.LONG && currentPrice > lastTrade.targetPrice) {
      return new LongPyramidStrategy(this.binanceCommunicator, this.lastTradeRepository, position.ticker, lastTrade.atr, currentPrice, position.amount, lastTrade.size)
    } else if (position.direction === Direction.SHORT && currentPrice < lastTrade.targetPrice) {
      return new ShortPyramidStrategy(this.binanceCommunicator, this.lastTradeRepository, position.ticker, lastTrade.atr, currentPrice, position.amount, lastTrade.size)
    }
    return null
  }

}