import {injectable} from "tsyringe";
import {TelegramHandler} from "../external/telegram/Telegram";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

@injectable()
export class TradeDetectService {


  constructor(private readonly telegram: TelegramHandler,
              private readonly binance: BinanceCommunicator) {
  }

  async run() {
    await this.binance.onStopMarketTrade(((ticker, type) => this.telegram.sendInfoMessage(`detect trade ${ticker}: ${type}`)));
  }
}