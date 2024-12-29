import {singleton} from "tsyringe";
import {TurtleSignal} from "../domain/TurtleSignal";
import {EntranceStrategy} from "../domain/entrance/EntranceStrategy";
import {LongEntranceStrategy} from "../domain/entrance/LongEntranceStrategy";
import {ShortEntranceStrategy} from "../domain/entrance/ShortEntranceStrategy";

@singleton()
export class EntranceStrategyFactory {

  create(ticker: string, price: number, turtleSignal: TurtleSignal): EntranceStrategy | undefined {
    if (price > turtleSignal.high20) {
      return new LongEntranceStrategy(ticker, turtleSignal)
    } else if (price < turtleSignal.low20) {
      return new ShortEntranceStrategy(ticker, turtleSignal)
    }
    return undefined
  }

}