import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {IndicatorReader} from "./IndicatorReader";
import {EntranceStrategyFactory} from "./EntranceStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";
// import {LastTradeRepository} from "../external/db/LastTradeRepository";

@injectable()
export class PositionEntranceService {

  constructor(private readonly binance: BinanceCommunicator,
              private readonly indicator: IndicatorReader,
              private readonly entranceStrategyRepository: EntranceStrategyFactory,
              private readonly telegram: TelegramHandler,
              // private readonly lastTradeRepository: LastTradeRepository
  ) {
  }

  async run() {
    const tickers = await this.binance.fetchTickers()
    const positions = await this.binance.fetchPositions()
    const prices = await this.binance.fetchPrices()
    for (const ticker of tickers) {
      const signal = await this.indicator.readTurtleSignal(ticker)
      const position = positions[ticker]
      const price = prices[ticker]
      if (!signal || position) {
        continue;
      }
      const strategy = this.entranceStrategyRepository.create(ticker, price, signal)
      if (!strategy) {
        continue;
      }
      await strategy.run(price, this.binance, this.indicator, this.telegram)
    }
  }
}