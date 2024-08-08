// Import necessary classes and constants from discord.js
const { Routes, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require('discord.js');

// Define the slash commands to be registered
const commands = [
    
    new SlashCommandBuilder()
        .setName('createparty')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('purpose')
                .setDescription('What reason are you making the party?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('gameplay_type')
                .setDescription('What reason are you making the party?')
                .setRequired(true)
                .addChoices(
                    { name: 'PvP', value: '0' },
                    { name: 'PvE', value: '1' },
                    { name: 'PvX', value: '2' },
                    { name: 'Social', value: '3' },
                    { name: 'Other', value: '4' }
                )),

    new SlashCommandBuilder()
        .setName('createevent')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('1')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('createraidpve')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('2')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('createraidpvp')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('3')
                .setRequired(true)),

].map(command => command.toJSON()); // Convert commands to JSON format

// Function to register the slash commands
async function registerCommands(rest, clientId, guildId) {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register the commands with the Discord API for a specific guild
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error); // Log any errors
    }
}

// Function to reset commands
async function resetCommands(rest, clientId, guildId) {
    try {
        console.log('Started resetting application (/) commands.');

        // **Reset global commands**
        // Fetch all existing global commands
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));

        // Delete each global command
        for (const command of globalCommands) {
            await rest.delete(`${Routes.applicationCommands(clientId)}/${command.id}`);
            console.log(`Deleted global command ${command.name}`);
        }

        // Reset guild commands
        // Fetch all existing commands for the guild
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));

        // Delete each guild-specific command
        for (const command of guildCommands) {
            await rest.delete(`${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`);
            console.log(`Deleted guild command ${command.name}`);
        }

        // Re-register the updated commands (guild-specific in this case)
        await registerCommands(rest, clientId, guildId);

        console.log('Successfully reset and reloaded application (/) commands.');
    } catch (error) {
        console.error(error); // Log any errors
    }
}


// Function to handle interactions
async function handleInteraction(interaction) {
    if (!interaction.isCommand() && !interaction.isButton()) return; // Ignore non-command and non-button interactions

    const { commandName, options } = interaction; // Destructure commandName and options from the interaction

    if (commandName === 'createparty') {
        await interaction.deferReply();
        await interaction.editReply('Testing -createparty-');
        
    }

    if (commandName === 'createevent') {
        await interaction.deferReply();
        await interaction.editReply('Testing -createevent-');
        
    }

    if (commandName === 'createraidpvp') {
        await interaction.deferReply();
        await interaction.editReply('Testing -createraidpvp-');
        
    }

    if (commandName === 'createraidpve') {
        await interaction.deferReply();
        await interaction.editReply('Testing -createraidpve-');
        
    }
    
}

// Export the functions for use in other files
module.exports = { registerCommands, resetCommands, handleInteraction };
