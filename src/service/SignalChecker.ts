// import {singleton} from "tsyringe";
// import {BinanceCommunicator} from "../external/http/BinanceCommunicator";
// import {IndicatorReader} from "./IndicatorReader";
// import {TelegramHandler} from "../external/telegram/Telegram";
// import node_cron from "node-cron";
// import {EntranceStrategyFactory} from "./EntranceStrategyFactory";
// import {PyramidRepository} from "../external/db/PyramidRepository";
//
// @singleton()
// export class SignalChecker {
//
//   private tickers: string[] = []
//
//   constructor(private readonly communicator: BinanceCommunicator,
//               private readonly indicators: IndicatorReader,
//               private readonly telegram: TelegramHandler,
//               private readonly entranceFactory: EntranceStrategyFactory,
//               private readonly pyramidRepository: PyramidRepository) {
//     node_cron.schedule("0 9 * * *", () => this.tickers = [])
//   }
//
//   async checkSignal() {
//     if (this.tickers.length === 0) {
//       this.tickers = await this.communicator.fetchTickers()
//     }
//     const tickers = [...this.tickers]
//     const positions = await this.communicator.fetchPositions()
//     const prices = await this.communicator.fetchPrices()
//     await Promise.all(tickers.map(async ticker => {
//       const position = positions[ticker]
//       const signal = await this.indicators.readTurtleSignal(ticker)
//       if (!signal) {
//         return
//       }
//       const price = prices[ticker]
//       if (position) {
//         await position.checkExitSignal(price, signal, this.communicator)
//         return
//       }
//       const strategy = this.entranceFactory.create(ticker, price, signal)
//       if (!strategy) {
//         return
//       }
//       const trade = await strategy.run(price, this.communicator, this.indicators, this.telegram)
//       await this.pyramidRepository.create(trade)
//     }))
//   }
// }