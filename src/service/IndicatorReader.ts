import {singleton} from "tsyringe";
import {IndicatorCalculator} from "../external/aws/IndicatorCalculator";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
import {TurtleSignal} from "../domain/TurtleSignal";
import node_cron from "node-cron";
import {TelegramHandler} from "../external/telegram/Telegram";

@singleton()
export class IndicatorReader {

  private readonly cache = new Map<string, TurtleSignal | null>()

  constructor(private readonly calculator: IndicatorCalculator,
              private readonly communicator: BinanceCommunicator,
              telegram: TelegramHandler) {
    node_cron.schedule("0 9 * * *", () => {
      this.cache.clear()
      telegram.sendInfoMessage("Turtle Signal cache is cleared by Timer.")
      .catch(reason => console.error(reason))
    })
  }

  async readTurtleSignal(ticker: string) {
    const cached = this.cache.get(ticker)
    if (cached || cached === null) {
      return cached
    }
    try {
      console.log(`No work caching ${ticker}`)
      const candles = await this.communicator.fetchCandles(ticker)
      const signal = await this.calculator.calculateTurtleSignal(candles)
      this.cache.set(ticker, signal)
      return signal
    } catch (e) {
      console.error(`Raise Error on turtleSignal: ${ticker}`)
      this.cache.set(ticker, null)
      return null
    }

  }

  async readAtr(ticker: string) {
    const candles = await this.communicator.fetchCandles(ticker)
    return this.calculator.calculateATR(candles, 20)
  }
}