import {PrismaClient} from "@prisma/client";
import {singleton} from "tsyringe";
import {Direction} from "../../domain/constants/Direction";

@singleton()
export class LastTradeRepository {

  private readonly client = new PrismaClient()

  upsert(ticker: string, direction: Direction, atr: number, size: number, targetPrice: number) {
    return this.client.lastTrade.upsert({
      create: {
        ticker, size, atr, targetPrice, notified: false, direction
      },
      update: {
        ticker, size, atr, targetPrice, notified: false, direction
      },
      where: {
        ticker
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
}