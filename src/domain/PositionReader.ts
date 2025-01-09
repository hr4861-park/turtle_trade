import {injectable} from "tsyringe";
import {BinanceCommunicator} from "../external/http/BinanceCommunicator";

@injectable()
export class PositionReader {
  constructor(private readonly binance: BinanceCommunicator) {

  }

  getPositions() {
    return this.binance.fetchPositions()
  }
}