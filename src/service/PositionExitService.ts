import {injectable} from "tsyringe";
import {PositionReader} from "../domain/PositionReader";
import {IndicatorReader} from "../domain/IndicatorReader";
import {ExitStrategyFactory} from "../domain/exit/ExitStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";
import {LastTradeRepository} from "../external/db/LastTradeRepository";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";


@injectable()
export class PositionExitService {

  constructor(private readonly positionReader: PositionReader,
              private readonly indicatorReader: IndicatorReader,
              private readonly exitStrategyFactory: ExitStrategyFactory,
              private readonly telegram: TelegramHandler,
              private readonly binance: BinanceCommunicator,
              private readonly lastTradeRepository: LastTradeRepository) {
  }

  async run() {
    const positions = await this.positionReader.getPositions()
    const prices = await this.binance.fetchPrices()
    for (const ticker in positions) {
      try {
        const signal = await this.indicatorReader.readTurtleSignal(ticker)
        const position = positions[ticker]
        const price = prices[ticker]
        if (!position || !signal || !price) {
          continue
        }
        const strategy = this.exitStrategyFactory.createStrategy(position, signal, price)
        if (!strategy) {
          continue
        }
        if (!await strategy.run()) {
          await this.lastTradeRepository.delete(ticker)
          await this.telegram.sendInfoMessage(`Exist position Loss: ${JSON.stringify(position)}`)
        } else {
          await this.telegram.sendInfoMessage(`Exist position Profit: ${JSON.stringify(position)}`)
        }
      } catch (e) {
        await this.telegram.sendErrorMessage(`Raise error on PositionExist ${ticker}: ${JSON.stringify(e)}`)
      }
    }
  }
}