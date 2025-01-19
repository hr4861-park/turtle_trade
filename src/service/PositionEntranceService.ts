import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {IndicatorReader} from "../domain/IndicatorReader";
import {EntranceStrategyFactory} from "../domain/entrance/EntranceStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";
import {LastTradeRepository} from "../external/db/LastTradeRepository";

@injectable()
export class PositionEntranceService {

  constructor(private readonly binance: BinanceCommunicator,
              private readonly indicator: IndicatorReader,
              private readonly entranceStrategyFactory: EntranceStrategyFactory,
              private readonly telegram: TelegramHandler,
              private readonly lastTradeRepository: LastTradeRepository
  ) {
  }

  async run() {
    const tickers = await this.binance.fetchTickers()
    const positions = await this.binance.fetchPositions()
    const prices = await this.binance.fetchPrices()
    for (const ticker of tickers) {
      try {
        const signal = await this.indicator.readTurtleSignal(ticker)
        const position = positions[ticker]
        const price = prices[ticker]
        const lastTrade = await this.lastTradeRepository.select(ticker)
        if (!signal || position || lastTrade) {
          continue;
        }
        const strategy = this.entranceStrategyFactory.create(ticker, price, signal)
        if (!strategy) {
          continue;
        }
        const trade = await strategy.run(price, this.binance, this.indicator, this.telegram)
        await this.lastTradeRepository.upsert(trade.ticker, trade.atr, trade.amount, trade.entryPosition + trade.atr)
      } catch (e) {
        await this.telegram.sendErrorMessage(`Raise error on positionEntrance ${ticker}: ${JSON.stringify(e)}`)
      }
    }
  }
}