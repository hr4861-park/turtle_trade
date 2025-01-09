import {singleton} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {LastTradeRepository} from "../external/db/LastTradeRepository";

@singleton()
export class PyramidService {


  constructor(private readonly binance: BinanceCommunicator,
              private readonly lastTradeRepository: LastTradeRepository) {
  }

  async run() {
    const positions = await this.binance.fetchPositions();
    const prices = await this.binance.fetchPrices()
    for (const ticker in positions) {
      const position = positions[ticker]
      const lastTrade = await this.lastTradeRepository.select(ticker)
      const price = prices[ticker]
      if (!position || !lastTrade || !price) {
        continue;
      }
      
    }
  }
}