require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { registerCommands, handleInteraction } = require('./commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands(rest, client.user.id);
});

client.on('interactionCreate', handleInteraction);

client.login(process.env.DISCORD_TOKEN);
