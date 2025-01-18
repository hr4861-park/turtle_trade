import ccxt from "ccxt";
import {Candle} from "../../domain/Candle";
import dayjs from 'dayjs'
import {singleton} from "tsyringe";
import {Position} from "../../domain/Position";
import {Direction} from "../../domain/constants/Direction";


@singleton()
export class BinanceCommunicator {

  private readonly communicator = new ccxt.pro.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
    enableRateLimit: true,
    options: {
      defaultType: 'future'
    }
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
        direction: curr.side === 'long' ? Direction.LONG : Direction.SHORT,
        entryPrice: curr.entryPrice as number
      }
      return prev
    }, {})
  }

  closePosition = async (ticker: string, direction: Direction, amount: number): Promise<void> => {
    await this.communicator.createOrder(ticker, 'market', direction === Direction.LONG ? 'sell' : 'buy', Math.abs(amount))
    const orders = await this.communicator.fetchOpenOrders(ticker)
    await this.communicator.cancelOrders(orders.map(order => order.id), ticker)
  }

  enterPosition = async (ticker: string, position: Direction, amount: number): Promise<void> => {
    await this.communicator.createOrder(ticker, 'market', position, amount)
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

  async setStopLoss(ticker: string, direction: Direction, amount: number, stopLossPrice: number) {

    const openedStopLosses = await this.communicator.fetchOpenOrders(ticker)
    .then(orders => orders.filter(order => order.type === 'stop_market'));
    for (const openedStopLoss of openedStopLosses) {
      await this.communicator.cancelOrder(openedStopLoss.id, ticker)
    }

    return this.communicator.createOrder(ticker, 'STOP_MARKET', direction === Direction.LONG ? Direction.SHORT : Direction.LONG,
        amount, undefined, {
          closePosition: true,
          stopPrice: stopLossPrice
        })
  }

  async onStopMarketTrade(callback: (ticker: string, type: string) => Promise<void>) {
    const trades = await this.communicator.watchMyTrades()
    for (const trade of trades) {
      await callback(trade.symbol as string, trade.type as string)
    }
  }
}

