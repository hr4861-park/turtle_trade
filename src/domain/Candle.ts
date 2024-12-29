import {tags} from "typia";

export interface Candle {
  dateTime: string & tags.Format<'date-time'>
  open: number,
  close: number,
  high: number,
  low: number,
  volume: number
}
