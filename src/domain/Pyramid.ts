import {Direction} from "./constants/Direction";

export interface Pyramid {
  ticker: string,
  unitSize: number,
  targetPrice: number,
  atr: number,
  direction: Direction
}

// export class Pyramid {
//
//   constructor(private readonly ticker: string,
//               private readonly unitSize: number,
//               private readonly targetPrice: number,
//               private readonly atr: number,
//               private readonly direction: Direction
//   ) {
//
//   }
//
//   async run(currentPrice: number, binance: BinanceCommunicator) {
//     if (currentPrice > this.targetPrice)
//       await binance.enterPosition(this.ticker, this.direction, this.unitSize)
//   }
//
//   static fromTrade({amount, atr, direction, entryPosition, ticker}: Trade) {
//     return new Pyramid(ticker, amount, entryPosition + atr, atr, direction)
//   }
// }