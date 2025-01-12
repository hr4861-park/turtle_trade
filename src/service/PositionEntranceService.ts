import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {IndicatorReader} from "../domain/IndicatorReader";
import {EntranceStrategyFactory} from "../domain/entrance/EntranceStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";
import {LastTradeRepository} from "../external/db/LastTradeRepository";
import {Direction} from "../domain/constants/Direction";

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
        if (!signal || position) {
          continue;
        }
        const strategy = this.entranceStrategyFactory.create(ticker, price, signal)
        if (!strategy) {
          continue;
        }
        const lastTrade = await this.lastTradeRepository.select(ticker)
        if (lastTrade && lastTrade.direction === strategy.getDirection()) {
          continue;
        }
        const trade = await strategy.run(price, this.binance, this.indicator, this.telegram)
        const bit = trade.direction === Direction.LONG ? 1 : -1
        await this.lastTradeRepository.upsert(trade.ticker, trade.direction, trade.atr, trade.amount, trade.entryPosition + trade.atr * bit)
      } catch (e) {
        await this.telegram.sendErrorMessage(`Raise error on positionEntrance ${ticker}: ${JSON.stringify(e)}`)
      }
    }
  }
}