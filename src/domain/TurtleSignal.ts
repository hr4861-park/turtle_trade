import typia from "typia";
import {Candle} from "./Candle";

export const parseTurtleSignal = typia.json.createAssertParse<TurtleSignal>()

export interface TurtleSignal extends Omit<Candle, 'dateTime'> {
  high10: number,
  high20: number,
  high55: number,
  low10: number,
  low20: number,
  low55: number
}
