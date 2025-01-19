import ccxt from "ccxt";
import {Candle} from "../../domain/Candle";
import dayjs from 'dayjs'
import {singleton} from "tsyringe";
import {Position} from "../../domain/Position";


@singleton()
export class BinanceCommunicator {

  private readonly communicator = new ccxt.pro.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
    enableRateLimit: true,
  })

  fetchCandles = async (ticker: string) => {
    const value = await this.communicator.fetchOHLCV(ticker, '1d', undefined, 60);
    return value.map((x): Candle => ({
      dateTime: dayjs(x[0] as number).toJSON(),
      open: x[1] ?? 0,
      high: x[2] ?? 0,
      low: x[3] ?? 0,
      close: x[4] ?? 0,
      volume: x[5] ?? 0
    }));
  }

  fetchTickers = async () => {
    const tickers = await this.communicator.fetchTickers()
    return Object.keys(tickers).filter(ticker => ticker.endsWith("USDT"))
  }

  fetchPrices = async () => {
    const tickers = await this.communicator.fetchTickers()
    // console.log(tickers)
    return Object.keys(tickers).reduce<Record<string, number>>((prev, ticker) => {
      if (!ticker.endsWith("USDT")) {
        return prev
      }
      prev[ticker] = tickers[ticker].last as number
      return prev
    }, {})
  }

  fetchPositions = async () => {
    const positions = await this.communicator.fetchPositions()
    return positions.reduce<Record<string, Position>>((prev, curr) => {
      prev[curr.symbol] = {
        ticker: curr.symbol,
        amount: curr.contracts as number,
        entryPrice: curr.entryPrice as number
      }
      return prev
    }, {})
  }

  closePosition = async (ticker: string, amount: number): Promise<void> => {
    await this.communicator.createOrder(ticker, 'market', 'sell', Math.abs(amount))
    const orders = await this.communicator.fetchOpenOrders(ticker)
    await this.communicator.cancelOrders(orders.map(order => order.id), ticker)
  }

  halfClose = async (position: Position): Promise<void> => {
    await this.communicator.createOrder(position.ticker, 'market', 'sell', Math.abs(position.amount / 2))
  }

  enterPosition = async (ticker: string, amount: number): Promise<void> => {
    await this.communicator.createOrder(ticker, 'market', "buy", amount)
  }

  fetchUSDTWallet = async (): Promise<{ total: number; free: number; }> => {
    const balance = await this.communicator.fetchBalance()
    return {
      total: balance['USDT'].total as number,
      free: balance['USDT'].free as number
    }
  }

  setLeverage(ticker: string, leverage: number) {
    return Promise.all(
        [
          this.communicator.setLeverage(leverage, ticker),
          this.communicator.setMarginMode('isolated', ticker)
        ]
    )
  }
}

