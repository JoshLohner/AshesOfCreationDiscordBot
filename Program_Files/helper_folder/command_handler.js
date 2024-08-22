const { Routes, SlashCommandBuilder, } = require('discord.js');
const { handleButtonInteraction } = require('./button_handler.js');
const createPartyCommand = require('../command_folder/createpartycommand.js');
const createEventCommand = require('../command_folder/createeventcommand.js');
const createRaidPvpCommand = require('../command_folder/createraidcommand.js');

const commands = [
    new SlashCommandBuilder()
        .setName('createparty')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('purpose')
                .setDescription('What reason are you making the party?')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('gameplay_type')
                .setDescription('What reason are you making the party?')
                .setRequired(true)
                .addChoices(
                    { name: 'PvP', value: 'PvP' },
                    { name: 'PvE', value: 'PvE' },
                    { name: 'PvX', value: 'PvX' },
                    { name: 'Social', value: 'Social' },
                    { name: 'Other', value: 'Other' }
                )
            )
        .addIntegerOption(option =>
            option.setName('party_size')
                .setDescription('Max Party Size')
                .setRequired(false)
                .setMaxValue(8)
                )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('More information about the activity')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('requirements')
                .setDescription('Requirements for joining the party')
                .setRequired(false)
        ),
            

    new SlashCommandBuilder()
        .setName('createevent')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('event_name')
                .setDescription('Name of the event')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('gameplay_type')
                .setDescription('What reason are you making the party?')
                .setRequired(true)
                .addChoices(
                    { name: 'PvP', value: 'PvP' },
                    { name: 'PvE', value: 'PvE' },
                    { name: 'PvX', value: 'PvX' },
                    { name: 'Social', value: 'Social' },
                    { name: 'Other', value: 'Other' }
                )
            )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('More information about the event')
                .setRequired(false)
            )
        .addStringOption(option =>
            option.setName('requirements')
                .setDescription('Minimum requirements for joining party')
                .setRequired(false)
            ),

    new SlashCommandBuilder()
        .setName('createraid')
        .setDescription('Format')
        .addStringOption(option =>
            option.setName('raid_name')
                .setDescription('What reason are you making the raid')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('gameplay_type')
                .setDescription('What reason are you making the raid?')
                .setRequired(true)
                .addChoices(
                    { name: 'PvP', value: 'PvP' },
                    { name: 'PvE', value: 'PvE' },
                    { name: 'PvX', value: 'PvX' },
                    { name: 'Social', value: 'Social' },
                    { name: 'Other', value: 'Other' }
                )
            )
        .addIntegerOption(option =>
            option.setName('raid_size')
                .setDescription('Max Raid Size: 40')
                .setRequired(false)
                .setMaxValue(40)
                )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('More information about the activity')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('requirements')
                .setDescription('Requirements for joining the raid')
                .setRequired(false)
        ),

    

].map(command => command.toJSON()); // Convert commands to JSON format

async function registerCommands(rest, clientId, guildId) {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function resetCommands(rest, clientId, guildId) {
    try {
        console.log('Started resetting application (/) commands.');
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        for (const command of globalCommands) {
            await rest.delete(`${Routes.applicationCommands(clientId)}/${command.id}`);
            console.log(`Deleted global command ${command.name}`);
        }
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        for (const command of guildCommands) {
            await rest.delete(`${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`);
            console.log(`Deleted guild command ${command.name}`);
        }
        await registerCommands(rest, clientId, guildId);
        console.log('Successfully reset and reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function handleInteraction(interaction) {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        switch (commandName) {
            case 'createparty':
                await createPartyCommand.execute(interaction);
                break;
            case 'createevent':
                await createEventCommand.execute(interaction);
                break;
            case 'createraid':
                await createRaidPvpCommand.execute(interaction);
                break;
            default:
                console.log(`Unknown command: ${commandName}`);
        }
    } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
    }
}

module.exports = { registerCommands, resetCommands, handleInteraction };
