import {Bot} from "./Bot";
import { Console } from "./CommandLine/Console";
import {ConfigService} from "./Service/ConfigService";
import {PresenceStatusData} from "discord.js";

console = (new Console());

const bot = new Bot();
bot.loginEvent.then(() => {
    console.info(`Logged in as ${bot.username}`);
    bot.setStatus(ConfigService.getConfig('activity.text'), ConfigService.getConfig('activity.status') as PresenceStatusData);
});

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
