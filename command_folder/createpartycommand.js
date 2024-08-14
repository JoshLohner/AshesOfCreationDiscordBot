const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { registerButtonHandler } = require('../button_handler');

module.exports = {
    name: 'createparty',
    async execute(interaction) {
        // Defer the reply to allow time for processing
        await interaction.deferReply();

        // Extract options from the interaction
        const purpose = interaction.options.getString('purpose');
        const gameplayType = interaction.options.getString('gameplay_type');
        const partySize = interaction.options.getInteger('party_size') || 'Max: 8';
        const description = interaction.options.getString('description') || 'No description provided';
        const requirements = interaction.options.getString('requirements') || 'No requirements specified';

        // Create an embed with the extracted information
        const embed = new EmbedBuilder()
            .setTitle(`Purpose: ${purpose}`)
            .setDescription('Party Finder Created')
            .setColor(0x00AE86)
            .addFields(
                { name: 'Description', value: description },
                { name: 'Gameplay_Type', value: gameplayType, inline: true },
                { name: 'Party_Size', value: partySize.toString(), inline: false },
                { name: 'Requirements', value: requirements }
            )
            .setTimestamp();

        // Create two rows of buttons
        const firstButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('button1').setLabel('Button 1').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button2').setLabel('Button 2').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button3').setLabel('Button 3').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button4').setLabel('Button 4').setStyle(ButtonStyle.Primary)
            );

        const secondButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('button5').setLabel('Button 5').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button6').setLabel('Button 6').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button7').setLabel('Button 7').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button8').setLabel('Button 8').setStyle(ButtonStyle.Primary)
            );

        // Register button handlers
        registerButtonHandler('button1', async (interaction) => {
            await interaction.reply('Button 1 was clicked!');
        });

        registerButtonHandler('button2', async (interaction) => {
            await interaction.reply('Button 2 was clicked!');
        });

        registerButtonHandler('button3', async (interaction) => {
            await interaction.reply('Button 3 was clicked!');
        });

        registerButtonHandler('button4', async (interaction) => {
            await interaction.reply('Button 4 was clicked!');
        });

        registerButtonHandler('button5', async (interaction) => {
            await interaction.reply('Button 5 was clicked!');
        });

        registerButtonHandler('button6', async (interaction) => {
            await interaction.reply('Button 6 was clicked!');
        });

        registerButtonHandler('button7', async (interaction) => {
            await interaction.reply('Button 7 was clicked!');
        });

        registerButtonHandler('button8', async (interaction) => {
            await interaction.reply('Button 8 was clicked!');
        });
        // Edit the reply with the embed and the rows of buttons
        await interaction.editReply({ embeds: [embed], components: [firstButtonRow, secondButtonRow] });
    },
};
