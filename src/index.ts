import 'dotenv/config'
import 'reflect-metadata'
import {container} from "tsyringe";
import {PositionEntranceService} from "./service/PositionEntranceService";
import {PositionExitService} from "./service/PositionExitService";
import {TelegramHandler} from "./external/telegram/Telegram";
import {IndicatorReader} from "./service/IndicatorReader";


const entranceService = container.resolve(PositionEntranceService)
const exitService = container.resolve(PositionExitService)
const telegram = container.resolve(TelegramHandler)
const indicator = container.resolve(IndicatorReader)

const entranceWork = async () => {
  await entranceService.run()
  setTimeout(entranceWork, 100)
}

const existWork = async () => {
  await exitService.run()
  setTimeout(existWork, 100)
}

const main = () => {
  indicator.initialize()
  .then(existWork)
  .then(entranceWork)
  .then(() => telegram.sendInfoMessage('Start App'))
  .then(() => telegram.registerCommand(/\/close (.+)/, async (msg, match) => {
    if (!match) return;
    await exitService.forceClose(match[1])
  }))
  .then(() => telegram.registerCommand(/\/turtle (.+)/, async (msg, match) => {
    if (!match) return;
    const result = await indicator.readTurtleSignal(match[1])
    if (result) {
      await telegram.sendInfoMessage(`Current ${match[1]}'s turtle Signal: ${JSON.stringify(result)}`)
    }
  }))
}


console.log("start main")
main()