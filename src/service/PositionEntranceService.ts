import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {IndicatorReader} from "./IndicatorReader";
import {PyramidRepository} from "../external/db/PyramidRepository";
import {EntranceStrategyFactory} from "./EntranceStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";

@injectable()
export class PositionEntranceService {

  constructor(private readonly binance: BinanceCommunicator,
              private readonly indicator: IndicatorReader,
              private readonly pyramidRepository: PyramidRepository,
              private readonly entranceStrategyRepository: EntranceStrategyFactory,
              private readonly telegram: TelegramHandler) {
  }

//   const position = positions[ticker]
//   const signal = await this.indicators.readTurtleSignal(ticker)
//   if (!signal) {
//   return
// }
// const price = prices[ticker]
// if (position) {
//   await position.checkExitSignal(price, signal, this.communicator)
//   return
// }
// const strategy = this.entranceFactory.create(ticker, price, signal)
// if (!strategy) {
//   return
// }
// const trade = await strategy.run(price, this.communicator, this.indicators, this.telegram)
// await this.pyramidRepository.create(trade)

  async run() {
    const tickers = await this.binance.fetchTickers()
    const positions = await this.binance.fetchPositions()
    const prices = await this.binance.fetchPrices()
    for (const ticker of tickers) {
      const signal = await this.indicator.readTurtleSignal(ticker)
      const position = positions[ticker]
      const price = prices[ticker]
      // const pyramid = await this.pyramidRepository.select(ticker)
      if (!signal || position) {
        continue;
      }
      const strategy = this.entranceStrategyRepository.create(ticker, price, signal)
      if (!strategy) {
        continue;
      }
      const trade = await strategy.run(price, this.binance, this.indicator, this.telegram)
      // await this.pyramidRepository.create(trade)
    }
  }
}