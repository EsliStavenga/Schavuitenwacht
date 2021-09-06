import {Client, ClientOptions, Intents, PresenceStatusData} from "discord.js";
import { ConfigService } from "./Service/ConfigService";

export class Bot {
    private readonly client: Client;
    public readonly loginEvent: Promise<string>;

    public get username(): string
    {
        return this.client.user.username;
    }

    public constructor()
    {
        this.client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        } as ClientOptions);

        // client.on('messageCreate', (message: Message) => {
        //     console.log(message.content)
        // });

        this.loginEvent = this.client.login(ConfigService.getConfig('token'));
    }

    public setStatus = (activity: string = undefined, status: PresenceStatusData = 'online'): void =>
    {
        // this.client.user.setStatus(status);
        // this.client.user.setActivity(activity);
        this.client.user.setPresence({
            status: status,
            afk: true
        })
    }
}