import {PrismaClient} from "@prisma/client";
import {singleton} from "tsyringe";
import {Direction} from "../../domain/constants/Direction";

@singleton()
export class LastTradeRepository {

  private readonly client = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
    errorFormat: 'pretty',
  })


  constructor() {
    // this.client.$on('query', e => console.log(`Query: ${e.query}\nParams: ${e.params}\nDuration: ${e.duration}`))
  }

  upsert(ticker: string, direction: Direction, atr: number, size: number, targetPrice: number) {
    return this.client.lastTrade.upsert({
      create: {
        ticker: ticker, size: size, atr: atr, targetPrice: targetPrice, notified: false, direction: direction,
      },
      update: {
        ticker: ticker, size: size, atr: atr, targetPrice: targetPrice, notified: false, direction: direction
      },
      where: {
        ticker: ticker
      }
    })
  }

  notified(ticker: string) {
    return this.client.lastTrade.update({
      data: {
        notified: true
      },
      where: {
        ticker
      }
    })
  }

  select(ticker: string) {
    return this.client.lastTrade.findUnique({
      where: {
        ticker: ticker
      }
    })
  }

  delete(ticker: string) {
    return this.client.lastTrade.deleteMany({
      where: {
        ticker
      }
    })
  }

  selectAll() {
    return this.client.lastTrade.findMany()
  }
}