// Import necessary classes and constants from discord.js
const { Routes, SlashCommandBuilder } = require('discord.js');


// Define the slash commands to be registered
const commands = [
    new SlashCommandBuilder()
        .setName('hi') // Command name
        .setDescription('Sends a Hello message'),  // Command description
    new SlashCommandBuilder()
        .setName('partycreate')
        .setDescription('Format: /partycreate activity size description')
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('Why are you making a party?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('size')
                .setDescription('Optional: What is the max size of the party?')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Optional: Additional information?')
                .setRequired(false)),
        
].map(command => command.toJSON()); // Convert commands to JSON format

// Function to register the slash commands
async function registerCommands(rest, clientId) {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register the commands with the Discord API
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error); // Log any errors
    }
}


// Function to handle interactions
async function handleInteraction(interaction) {
    if (!interaction.isCommand()) return; // Ignore non-command interactions

    const { commandName, options, channel } = interaction; // Destructure commandName and channel from the interaction

    if (commandName === 'hi') {
        await interaction.deferReply();
        let greetingMessage = "Hello, World";
        await interaction.editReply(greetingMessage); // Send a message to the same channel where the command was used
    }

    if (commandName === 'partycreate') {
        const activity = options.getString('activity');
        const size = options.getInteger('size');
        const description = options.getString('description');
        
        let message = `Party created for ${activity}.`;
        if (size) {
            message += ` Max size: ${size}.`;
        }
        if (description) {
            message += ` Description: ${description}.`;
        }

        // Acknowledge the interaction and send the message
        await interaction.deferReply();
        await interaction.editReply(message);
    }
}

// Export the functions for use in other files
module.exports = { registerCommands, handleInteraction };
