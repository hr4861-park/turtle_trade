import {singleton} from "tsyringe";
import {TurtleSignal} from "../TurtleSignal";
import {EntranceStrategy} from "./EntranceStrategy";
import {LongEntranceStrategy} from "./LongEntranceStrategy";
import {ShortEntranceStrategy} from "./ShortEntranceStrategy";

@singleton()
export class EntranceStrategyFactory {

  create(ticker: string, price: number, turtleSignal: TurtleSignal): EntranceStrategy | undefined {
    if (price > turtleSignal.high20 && turtleSignal.value_change > 0) {
      return new LongEntranceStrategy(ticker, turtleSignal)
    } else if (price < turtleSignal.low20 && turtleSignal.value_change < 0) {
      return new ShortEntranceStrategy(ticker, turtleSignal)
    }
    return undefined
  }

}