import {singleton} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {PyramidFactory} from "../domain/pyramid/PyramidFactory";
import {TelegramHandler} from "../external/telegram/Telegram";

@singleton()
export class PyramidService {


  constructor(private readonly binance: BinanceCommunicator,
              private readonly pyramidStrategyFactory: PyramidFactory,
              private readonly telegram: TelegramHandler) {
  }

  async run() {
    const positions = await this.binance.fetchPositions();
    const prices = await this.binance.fetchPrices()
    for (const ticker in positions) {
      const position = positions[ticker]
      const price = prices[ticker]
      if (!position || !price) {
        continue;
      }
      const pyramid = await this.pyramidStrategyFactory.create(position, price)
      if (pyramid) {
        await pyramid.run()
        await this.telegram.sendInfoMessage(`Run Pyramiding: ${ticker}`)
      }
    }
  }
}