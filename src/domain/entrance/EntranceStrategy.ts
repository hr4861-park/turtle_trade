import {TurtleSignal} from "../TurtleSignal";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {IndicatorReader} from "../../service/IndicatorReader";
import {TelegramHandler} from "../../external/telegram/Telegram";
import {Direction} from "../constants/Direction";
import {Trade} from "../Trade";

export abstract class EntranceStrategy {

  protected constructor(protected readonly ticker: string,
                        protected readonly turtleSignal: TurtleSignal) {
  }

  abstract getDetails(price: number, indicator: IndicatorReader): Promise<{
    atr: number,
    stopLoss: number,
    leverage: number,
    direction: Direction
  }>

  async run(price: number, communicator: BinanceCommunicator, indicators: IndicatorReader, telegram: TelegramHandler) {
    const wallet = await communicator.fetchUSDTWallet()
    const {atr, stopLoss, leverage, direction} = await this.getDetails(price, indicators)
    // const lastTradeDirection = await lastTradeRepository.select(this.ticker)

    const amount = (wallet.total * 0.1 / price) * leverage
    const tradeInfo: Trade = {
      ticker: this.ticker,
      direction: direction,
      entryPosition: price,
      atr: atr,
      stopLoss: stopLoss,
      leverage: leverage,
      amount: amount
    }

    if (wallet.total * 0.05 > wallet.free) {
      await telegram.sendWarningMessage(`No enter position: ${JSON.stringify({...tradeInfo, cause: "No free USD."})}`)
      indicators.deleteTurtleSignal(this.ticker)
    } else {
      await communicator.setLeverage(this.ticker, leverage)
      try {
        await communicator.enterPosition(this.ticker, direction, amount)
        await communicator.setStopLoss(this.ticker, direction, amount, stopLoss)
        // await lastTradeRepository.delete(this.ticker)
        await telegram.sendInfoMessage(`Success enter position: ${JSON.stringify(tradeInfo)}`)
      } catch (e) {
        console.error(e)
        await telegram.sendErrorMessage(`Failed enter position: ${JSON.stringify({...tradeInfo, cause: e})}`)
      }
    }

    return tradeInfo
  }

  abstract getDirection(): Direction;
}

