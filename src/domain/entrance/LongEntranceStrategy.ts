import {EntranceStrategy} from "./EntranceStrategy";
import {TurtleSignal} from "../TurtleSignal";
import {IndicatorReader} from "../IndicatorReader";
import {Direction} from "../constants/Direction";

export class LongEntranceStrategy extends EntranceStrategy {
  getDirection() {
    return Direction.LONG
  }

  async getDetails(price: number, indicator: IndicatorReader) {
    const atr = await indicator.readAtr(this.ticker)
    const stopLoss = price - atr * 2
    const difference = Math.abs(price - stopLoss)
    const percentageDifference = (difference / price) * 100
    const leverage = Math.floor(100 / percentageDifference)

    return {
      atr,
      stopLoss,
      leverage,
      direction: Direction.LONG
    }
  }

  constructor(protected readonly ticker: string, protected readonly turtleSignal: TurtleSignal) {
    super(ticker, turtleSignal);
  }

}

