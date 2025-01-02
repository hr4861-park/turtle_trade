import {InvokeCommand, LambdaClient} from "@aws-sdk/client-lambda";
import {Candle} from "../../domain/Candle";
import {parseTurtleSignal} from "../../domain/TurtleSignal";
import {singleton} from "tsyringe";

@singleton()
export class IndicatorCalculator {
  private readonly lambdaClient = new LambdaClient({region: 'ap-northeast-2'})

  async calculateTurtleSignal(candles: Candle[]) {
    const command = new InvokeCommand({
      FunctionName: 'turtle',
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(candles))
    })

    const response = await this.lambdaClient.send(command)
    if (!response.Payload) {
      console.error(response.FunctionError)
      throw new Error("Raised Error on Calculate Turtle signal")
    }
    const result = Buffer.from(response.Payload).toString().replace(/^"|"$/g, "").replace(/\\/g, "");
    return parseTurtleSignal(result)
  }

  async calculateATR(candles: Candle[], length: number) {
    const command = new InvokeCommand({
      FunctionName: 'atr',
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify({candles, length}))
    })

    const response = await this.lambdaClient.send(command)
    if (!response.Payload) {
      throw new Error("Raise Error on Calculate ATR")
    }
    return Number(Buffer.from(response.Payload).toString())
  }
}

