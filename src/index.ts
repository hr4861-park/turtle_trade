import 'dotenv/config'
import 'reflect-metadata'
import {container} from "tsyringe";
import {PositionEntranceService} from "./service/PositionEntranceService";
import {PositionExitService} from "./service/PositionExitService";
import {TelegramHandler} from "./external/telegram/Telegram";



const entranceService = container.resolve(PositionEntranceService)
const exitService = container.resolve(PositionExitService)
const telegram = container.resolve(TelegramHandler)

const entranceWork = async () => {
  await entranceService.run()
  setTimeout(entranceWork, 100)
}

const existWork = async () => {
  await exitService.run()
  setTimeout(existWork, 100)
}

existWork()
entranceWork()

telegram.sendInfoMessage('Start App')
.then(() => {
  telegram.registerCommand(/\/close (.+)/, async (msg, match) => {
    if (!match) return;
    await exitService.forceClose(match[1])
  })
})