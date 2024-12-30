import {PrismaClient} from "@prisma/client";
import {singleton} from "tsyringe";
import {Direction} from "../../domain/constants/Direction";

@singleton()
export class LastTradeRepository {

  private readonly client = new PrismaClient()

  create(ticker: string, direction: Direction) {
    return this.client.lastTrade.create({
      data: {
        ticker, direction, notified: false
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
    return this.client.lastTrade.delete({
      where: {
        ticker
      }
    })
  }
}