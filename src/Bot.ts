import {Client, ClientOptions, Intents, Message} from "discord.js";
import { ConfigService } from "./Service/ConfigService";

export class Bot {
    public listen(): Promise<string> {
        let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] } as ClientOptions);
        client.on('messageCreate', (message: Message) => {
            console.log(message.content)
        });

        return client.login(ConfigService.instance.getConfig('token'));
    }
}