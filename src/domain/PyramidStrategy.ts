import {Direction} from "./constants/Direction";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

export abstract class PyramidStrategy {

  constructor(public readonly ticker: string,
              public readonly unitSize: number,
              public readonly targetPrice: number,
              public readonly atr: number,
              public readonly direction: Direction
  ) {

  }

  async run(currentPrice: number, binance: BinanceCommunicator) {
    if (!this.isDetected()) {
      return;
    }

    await binance.enterPosition(this.ticker, this.direction, this.unitSize)
  }

  abstract isDetected(): boolean
}