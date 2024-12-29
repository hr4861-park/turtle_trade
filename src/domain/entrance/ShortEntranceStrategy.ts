import {EntranceStrategy} from "./EntranceStrategy";
import {TurtleSignal} from "../TurtleSignal";
import {IndicatorReader} from "../../service/IndicatorReader";
import {Direction} from "../constants/Direction";

export class ShortEntranceStrategy extends EntranceStrategy {
  getDirection() {
    return Direction.SHORT
  }

  async getDetails(price: number, indicator: IndicatorReader): Promise<{
    atr: number;
    stopLoss: number;
    leverage: number;
    direction: Direction;
  }> {
    const atr = await indicator.readAtr(this.ticker)
    const stopLoss = price + atr * 2
    const difference = Math.abs(price - stopLoss)
    const percentageDifference = (difference / price) * 100
    const leverage = Math.floor(100 / percentageDifference)

    return {
      atr,
      stopLoss,
      leverage,
      direction: Direction.SHORT
    }
  }

  constructor(protected readonly ticker: string, protected readonly turtleSignal: TurtleSignal) {
    super(ticker, turtleSignal);
  }

}