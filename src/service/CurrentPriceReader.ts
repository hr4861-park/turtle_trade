import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

@injectable()
export class CurrentPriceReader {

  private prices: Record<string, number> = {}

  constructor(private readonly binance: BinanceCommunicator) {
    const refresh = async () => {
      this.prices = await this.binance.fetchPrices()
      setTimeout(refresh, 1000)
    }

    refresh()
  }

  readPrices() {
    return this.prices
  }

  readPrice(ticker: string) {
    return this.prices[ticker]
  }
}