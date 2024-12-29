import TelegramBot from "node-telegram-bot-api";
import {singleton} from "tsyringe";

@singleton()
export class TelegramHandler {

  private readonly bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, {polling: true});
  private readonly myToken = '1148141159'

  sendErrorMessage = async (msg: string) => {
    await this.bot.sendMessage(this.myToken, `❌ ${msg}`)
  }


  sendInfoMessage = async (msg: string) => {
    await this.bot.sendMessage(this.myToken, `✅ ${msg}`)
  }


  sendWarningMessage = async (msg: string) => {
    await this.bot.sendMessage(this.myToken, `⚠️ ${msg}`)
  }
}