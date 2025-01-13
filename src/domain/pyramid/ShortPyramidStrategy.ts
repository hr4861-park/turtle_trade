import {PyramidStrategy} from "./PyramidStrategy";
import {BinanceCommunicator} from "../../external/http/BinanceCommunicator";
import {Direction} from "../constants/Direction";
import {LastTradeRepository} from "../../external/db/LastTradeRepository";


export class ShortPyramidStrategy implements PyramidStrategy {

  private readonly communicator: BinanceCommunicator;
  private readonly lastTradeRepository: LastTradeRepository;
  private readonly ticker: string
  private readonly atr: number;
  private readonly currentPrice: number;
  private readonly direction = Direction.SHORT;
  private readonly amount: number
  private readonly size: number;

  constructor(communicator: BinanceCommunicator, lastTradeRepository: LastTradeRepository, ticker: string, atr: number, currentPrice: number, amount: number, size: number) {
    this.communicator = communicator;
    this.lastTradeRepository = lastTradeRepository;
    this.ticker = ticker;
    this.atr = atr;
    this.currentPrice = currentPrice;
    this.amount = amount;
    this.size = size;
  }

  async run(): Promise<void> {
    await this.communicator.enterPosition(this.ticker, this.direction, this.size)
    await this.communicator.setStopLoss(this.ticker, this.direction, this.amount + this.size, this.currentPrice + this.atr * 2)
    await this.lastTradeRepository.upsert(this.ticker, this.direction, this.atr, this.size, this.currentPrice - this.atr)
  }
}