const { Routes } = require('discord.js');

const { SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Sends a Hello message'),
].map(command => command.toJSON());

async function registerCommands(rest, clientId) {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return;

    const { commandName, channel } = interaction;

    if (commandName === 'hi') {
        channel.send('Hello');
    }
}

module.exports = { registerCommands, handleInteraction };
