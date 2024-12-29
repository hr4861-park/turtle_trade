import {Direction} from "./constants/Direction";

export interface Position {
  ticker: string,
  amount: number,
  direction: Direction
  entryPrice: number
}

// export class Position {
//
//   private constructor(private readonly ticker: string,
//                       private readonly amount: number,
//                       private readonly direction: Direction
//   ) {
//   }
//
//   async checkExitSignal(price: number, signal: TurtleSignal, communicator: BinanceCommunicator) {
//     if (this.direction === Direction.LONG) {
//       if (price < signal.low10) {
//         await communicator.closePosition(this.ticker, this.direction, this.amount)
//       }
//     } else if (price > signal.high10) {
//       await communicator.closePosition(this.ticker, this.direction, this.amount)
//     }
//   }
//
//   static of({ticker, amount, direction}: {
//     ticker: string,
//     amount: number,
//     entryPrice: number,
//     direction: Direction
//   }): Position {
//     return new Position(ticker, amount, direction)
//   }
// }