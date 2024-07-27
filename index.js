// Load environment variables from the .env file
require('dotenv').config();

// Import necessary classes and functions from discord.js and custom commands module
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { registerCommands, handleInteraction } = require('./commands');

// Create a new Discord client instance with specified intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Create a new REST client instance for making API requests and set the bot token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Event listener for when the client is ready and successfully logged in
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`); // Log the bot's username and discriminator
    await registerCommands(rest, client.user.id); // Register slash commands using the REST client and bot's user ID
});

// Event listener for when an interaction is created (e.g., a slash command is used)
client.on('interactionCreate', handleInteraction);

// Log in to Discord using the bot token from environment variables
client.login(process.env.DISCORD_TOKEN);
