import {singleton} from "tsyringe";
import {TurtleSignal} from "../TurtleSignal";
import {EntranceStrategy} from "./EntranceStrategy";
import {LongEntranceStrategy} from "./LongEntranceStrategy";

@singleton()
export class EntranceStrategyFactory {

  create(ticker: string, price: number, turtleSignal: TurtleSignal): EntranceStrategy | undefined {
    if (price > turtleSignal.high20) {
      return new LongEntranceStrategy(ticker, turtleSignal)
    }
    return undefined
  }

}