import { Client, ClientOptions, Intents } from "discord.js";
import { ConfigService } from "./Service/ConfigService";

export class Bot {
    private readonly client: Client;
    public readonly loginEvent: Promise<string>;

    public constructor()
    {
        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        } as ClientOptions);

        // client.on('messageCreate', (message: Message) => {
        //     console.log(message.content)
        // });

        this.loginEvent = this.client.login(ConfigService.instance.getConfig('token'));
    }
}