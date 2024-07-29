// Import necessary classes and constants from discord.js
const { Routes, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');

// Define the slash commands to be registered
const commands = [
    new SlashCommandBuilder()
        .setName('bye') // Command name
        .setDescription('Sends a goodbye'),
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
    new SlashCommandBuilder()
        .setName('eventcreate')
        .setDescription('Creates an event with an attend button')
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
    if (!interaction.isCommand() && !interaction.isButton()) return; // Ignore non-command and non-button interactions

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

    if (commandName === 'bye') {
        await interaction.deferReply();
        let greetingMessage = "Goodbye, World";
        await interaction.editReply(greetingMessage); // Send a message to the same channel where the command was used
    }

    if (commandName === 'eventcreate') {
        const attendButton = new ButtonBuilder()
            .setCustomId('attend')
            .setLabel('Attend')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(attendButton);

        await interaction.deferReply();
        const message = await interaction.editReply({
            content: 'Event created! Click the button to attend.',
            components: [row]
        });

        // Initialize attendance count
        let attendanceCount = 0;

        const filter = i => i.customId === 'attend' && i.message.id === message.id;

        const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            attendanceCount++;
            await i.update({
                content: `Event created! ${attendanceCount} people are attending.`,
                components: [row]
            });
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    }
}

// Export the functions for use in other files
module.exports = { registerCommands, handleInteraction };
