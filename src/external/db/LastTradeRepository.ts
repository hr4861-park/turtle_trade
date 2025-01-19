import {PrismaClient} from "@prisma/client";
import {singleton} from "tsyringe";

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

  upsert(ticker: string, atr: number, size: number, targetPrice: number) {
    return this.client.lastTrade.upsert({
      create: {
        ticker: ticker, size: size, atr: atr, targetPrice: targetPrice
      },
      update: {
        ticker: ticker, size: size, atr: atr, targetPrice: targetPrice
      },
      where: {
        ticker: ticker
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