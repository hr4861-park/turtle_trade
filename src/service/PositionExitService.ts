import {injectable} from "tsyringe";
import {PositionReader} from "../domain/PositionReader";
import {IndicatorReader} from "../domain/IndicatorReader";
import {CurrentPriceReader} from "../domain/CurrentPriceReader";
import {ExitStrategyFactory} from "../domain/exit/ExitStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";
import {LastTradeRepository} from "../external/db/LastTradeRepository";


@injectable()
export class PositionExitService {

  constructor(private readonly positionReader: PositionReader,
              private readonly indicatorReader: IndicatorReader,
              private readonly priceReader: CurrentPriceReader,
              private readonly exitStrategyFactory: ExitStrategyFactory,
              private readonly telegram: TelegramHandler,
              private readonly lastTradeRepository: LastTradeRepository) {
  }

  async run() {
    const positions = await this.positionReader.getPositions()
    for (const ticker in positions) {
      const signal = await this.indicatorReader.readTurtleSignal(ticker)
      const position = positions[ticker]
      if (!position || !signal) {
        return
      }
      const price = this.priceReader.readPrice(ticker)
      const strategy = this.exitStrategyFactory.createStrategy(position, signal, price)
      if (!strategy) {
        continue
      }
      if (!await strategy.run()) {
        await this.lastTradeRepository.delete(ticker)
        await this.telegram.sendInfoMessage(`Exist position Loss: ${JSON.stringify(position)}`)
      }
      await this.telegram.sendInfoMessage(`Exist position Profit: ${JSON.stringify(position)}`)
    }
  }

  async forceClose(ticker: string) {
    const positions = await this.positionReader.getPositions()
    const position = positions[ticker]
    if (!position) {
      return
    }
    const price = this.priceReader.readPrice(ticker)
    const signal = await this.indicatorReader.readTurtleSignal(ticker)
    if (!signal) {
      return
    }
    this.indicatorReader.deleteTurtleSignal(ticker)
    if (!this.exitStrategyFactory.createStrategy(positions[ticker], signal, price)?.forceClose()) {
      await this.lastTradeRepository.delete(ticker)
      await this.telegram.sendInfoMessage(`Exist position Loss: ${JSON.stringify(position)}`)
    }
    await this.telegram.sendInfoMessage(`Exist position Profit: ${JSON.stringify(position)}`)
  }
}