import {TurtleSignal} from "../TurtleSignal";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {IndicatorReader} from "../IndicatorReader";
import {TelegramHandler} from "../../external/telegram/Telegram";
import {Trade} from "../Trade";

export abstract class EntranceStrategy {

  protected constructor(protected readonly ticker: string,
                        protected readonly turtleSignal: TurtleSignal) {
  }

  async run(price: number, communicator: BinanceCommunicator, indicators: IndicatorReader, telegram: TelegramHandler) {
    const wallet = await communicator.fetchUSDTWallet()
    const atr = await indicators.readAtr(this.ticker)
    const amount = (wallet.total * 0.01 / price)
    const tradeInfo: Trade = {
      ticker: this.ticker,
      entryPosition: price,
      atr: atr,
      amount: amount
    }

    if (wallet.total * 0.01 > wallet.free) {
      await telegram.sendWarningMessage(`No enter position: ${JSON.stringify({...tradeInfo, cause: "No free USD."})}`)
    } else {
      try {
        await communicator.enterPosition(this.ticker, amount)
        await telegram.sendInfoMessage(`Success enter position: ${JSON.stringify(tradeInfo)}`)
      } catch (e) {
        console.error(e)
        await telegram.sendErrorMessage(`Failed enter position: ${JSON.stringify({...tradeInfo, cause: e})}`)
      }
    }

    return tradeInfo
  }
}

