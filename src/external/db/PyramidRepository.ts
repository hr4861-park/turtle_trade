import {injectable} from "tsyringe";
import {PrismaClient} from "@prisma/client";
import {Trade} from "../../domain/Trade";
import {Pyramid} from "../../domain/Pyramid";
import {Direction} from "../../domain/constants/Direction";

@injectable()
export class PyramidRepository {


  private readonly prisma = new PrismaClient()

  async create({amount, atr, direction, entryPosition, stopLoss, ticker}: Trade) {
    await this.prisma.pyramid.create({
      data: {
        ticker,
        direction,
        atr,
        unitSize: amount,
        count: 1,
        targetPrice: direction === Direction.LONG ? entryPosition + atr : entryPosition - atr
      }
    })
  }

  async select(ticker: string) {
    const result = await this.prisma.pyramid.findFirst({
      where: {
        ticker: ticker
      }
    })
    if (!result) {
      return result
    } else {
      const pyramid: Pyramid = {
        atr: result.atr.toNumber(),
        ticker: result.ticker,
        unitSize: result.unitSize.toNumber(),
        direction: result.direction,
        targetPrice: result.targetPrice.toNumber()
      }
      return pyramid
    }
  }

  delete(ticker: string) {
    return this.prisma.pyramid.delete({
      where: {
        ticker: ticker
      }
    })
  }

}