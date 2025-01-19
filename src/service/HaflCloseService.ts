import {injectable} from "tsyringe";
import node_cron from "node-cron";
import {IndicatorReader} from "../domain/IndicatorReader";
import {PositionReader} from "../domain/PositionReader";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

@injectable()
export class HalfCutService {


  constructor(private readonly indicatorReader: IndicatorReader,
              private readonly positionReader: PositionReader,
              private readonly binance: BinanceCommunicator) {
  }

  run() {
    node_cron.schedule("5 9 * * *", async () => {
      const positions = await this.positionReader.getPositions()
      const prices = await this.binance.fetchPrices()
      for (const ticker in positions) {
        const signal = await this.indicatorReader.readTurtleSignal(ticker)
        const price = prices[ticker]
        if (!signal) {
          continue;
        }
        if (signal.value_change < 0 && positions[ticker].entryPrice < price) {
          await this.binance.halfClose(positions[ticker])
        }
      }
    })
  }


}