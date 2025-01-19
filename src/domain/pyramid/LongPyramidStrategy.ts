import {PyramidStrategy} from "./PyramidStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";

import {LastTradeRepository} from "../../external/db/LastTradeRepository";


export class LongPyramidStrategy implements PyramidStrategy {

  private readonly communicator: BinanceCommunicator;
  private readonly lastTradeRepository: LastTradeRepository;
  private readonly ticker: string
  private readonly atr: number;
  private readonly currentPrice: number;
  private readonly size: number;

  constructor(communicator: BinanceCommunicator, lastTradeRepository: LastTradeRepository, ticker: string, atr: number, currentPrice: number, amount: number, size: number) {
    this.communicator = communicator;
    this.lastTradeRepository = lastTradeRepository;
    this.ticker = ticker;
    this.atr = atr;
    this.currentPrice = currentPrice;
    this.size = size;
  }

  async run(): Promise<void> {
    await this.lastTradeRepository.upsert(this.ticker, this.atr, this.size, this.currentPrice + this.atr)
    await this.communicator.enterPosition(this.ticker, this.size)
  }
}