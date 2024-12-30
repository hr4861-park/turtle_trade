import {injectable} from "tsyringe";
import {PositionReader} from "./PositionReader";
import {IndicatorReader} from "./IndicatorReader";
import {CurrentPriceReader} from "./CurrentPriceReader";
import {ExitStrategyFactory} from "./ExitStrategyFactory";
import {TelegramHandler} from "../external/telegram/Telegram";


@injectable()
export class PositionExitService {

  constructor(private readonly positionReader: PositionReader,
              private readonly indicatorReader: IndicatorReader,
              private readonly priceReader: CurrentPriceReader,
              private readonly exitStrategyFactory: ExitStrategyFactory,
              private readonly telegram: TelegramHandler) {
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
      const strategy = this.exitStrategyFactory.createStrategy(position)
      if (!strategy) {
        continue
      }
      if (await strategy.run(price, signal)) {
        await this.telegram.sendInfoMessage(`Exist position: ${JSON.stringify(position)}`)
      }
    }
  }

  async forceClose(ticker: string) {
    const positions = await this.positionReader.getPositions()
    const position = positions[ticker]
    if (!position) {
      return
    }
    const price = this.priceReader.readPrice(ticker)
    this.exitStrategyFactory.createStrategy(positions[ticker])?.forceClose(price)
    await this.telegram.sendInfoMessage(`Exist position: ${JSON.stringify(position)}`)
  }
}