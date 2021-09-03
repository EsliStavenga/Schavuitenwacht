// console.log('test');

import {Client, ClientOptions, Intents, Message} from "discord.js";
export class Bot {
    public listen(): Promise<string> {
        let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] } as ClientOptions);
        client.on('messageCreate', (message: Message) => {
            console.log(message.content)
        });
        return client.login(Config.TOKEN);
    }
}

(new Bot()).listen().then(() => {
    console.log('Logged in!');
})

/*
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { fs } = require('fs');
const config = JSON.parse(fs.readFileSync('./config/config.json'));

const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(883418037812871218, 557666847537889321),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login('token');*/
