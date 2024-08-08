// Import necessary classes and constants from discord.js
const { Routes, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require('discord.js');

// Define the slash commands to be registered
const commands = [
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
    new SlashCommandBuilder()
        .setName('eventcreate')
        .setDescription('Creates an event with an attend button')
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

    if (commandName === 'partycreate') {
        const activity = options.getString('activity');
        const size = options.getInteger('size');
        const description = options.getString('description');
        
        let embed = new EmbedBuilder()
            .setTitle('Party Created')
            .setDescription(`Activity: ${activity}`)
            .setColor(0x00AE86)
            .addFields(
                { name: 'Max Size', value: size ? size.toString() : 'No limit', inline: true },
                { name: 'Description', value: description ? description : 'No description provided', inline: true }
            );

        // Acknowledge the interaction and send the embed message
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed] });
    }

    if (commandName === 'eventcreate') {
        const attendButton = new ButtonBuilder()
            .setCustomId('attend')
            .setLabel('Attend')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(attendButton);

        let embed = new EmbedBuilder()
            .setTitle('Event Created')
            .setDescription('Click the button to attend.')
            .setColor(0x00AE86);

        await interaction.deferReply();
        const message = await interaction.editReply({
            embeds: [embed],
            components: [row]
        });

        // Initialize attendance count
        let attendanceCount = 0;

        const filter = i => i.customId === 'attend' && i.message.id === message.id;

        const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            attendanceCount++;
            let updatedEmbed = new EmbedBuilder()
                .setTitle('Event Created')
                .setDescription(`Click the button to attend.\n${attendanceCount} people are attending.`)
                .setColor(0x00AE86);
            await i.update({
                embeds: [updatedEmbed],
                components: [row]
            });
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    }
}

// Export the functions for use in other files
module.exports = { registerCommands, resetCommands, handleInteraction };
