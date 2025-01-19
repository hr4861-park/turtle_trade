import {EntranceStrategy} from "./EntranceStrategy";
import {TurtleSignal} from "../TurtleSignal";

export class LongEntranceStrategy extends EntranceStrategy {
  constructor(protected readonly ticker: string, protected readonly turtleSignal: TurtleSignal) {
    super(ticker, turtleSignal);
  }

}

