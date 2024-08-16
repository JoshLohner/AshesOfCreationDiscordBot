const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { registerButtonHandler } = require('../button_handler');

// Object to store user data for each button
const buttonClickData = {
    button1: [],
    button2: [],
    button3: [],
    button4: [],
    button5: [],
    button6: [],
    button7: [],
    button8: []
};

module.exports = {
    name: 'createparty',
    async execute(interaction) {
        await interaction.deferReply();

        const purpose = interaction.options.getString('purpose');
        const gameplayType = interaction.options.getString('gameplay_type');
        const partySize = interaction.options.getInteger('party_size') || 'Max: 8';
        const description = interaction.options.getString('description') || 'No description provided';
        const requirements = interaction.options.getString('requirements') || 'No requirements specified';

        let embed = new EmbedBuilder()
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

        const updateEmbedWithUserClicks = () => {
            // Create a string that lists each user and the button they clicked
            let userClicks = '';
            for (const [buttonId, users] of Object.entries(buttonClickData)) {
                users.forEach(user => {
                    userClicks += `${user.name} clicked ${buttonId}\n`;
                });
            }

            // Update the embed with the consolidated information
            embed.spliceFields(4, embed.data.fields.length - 4);
            embed.addFields({ name: 'User Interactions', value: userClicks || 'No interactions yet', inline: false });
        };

        // Register button handlers with user tracking and embed updating
        const handleButtonClick = async (buttonId, interaction) => {
            const user = interaction.user;
            const userIndex = buttonClickData[buttonId].findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                // If the user has already clicked this button, remove them
                buttonClickData[buttonId].splice(userIndex, 1);
            } else {
                // Remove the user from any other button they've clicked
                for (const [id, users] of Object.entries(buttonClickData)) {
                    const idx = users.findIndex(u => u.id === user.id);
                    if (idx !== -1) {
                        users.splice(idx, 1);
                    }
                }
                // Add the user to the newly clicked button
                buttonClickData[buttonId].push({ id: user.id, name: user.username });
            }

            updateEmbedWithUserClicks();
            await interaction.update({ embeds: [embed] });
        };

        registerButtonHandler('button1', (interaction) => handleButtonClick('button1', interaction));
        registerButtonHandler('button2', (interaction) => handleButtonClick('button2', interaction));
        registerButtonHandler('button3', (interaction) => handleButtonClick('button3', interaction));
        registerButtonHandler('button4', (interaction) => handleButtonClick('button4', interaction));
        registerButtonHandler('button5', (interaction) => handleButtonClick('button5', interaction));
        registerButtonHandler('button6', (interaction) => handleButtonClick('button6', interaction));
        registerButtonHandler('button7', (interaction) => handleButtonClick('button7', interaction));
        registerButtonHandler('button8', (interaction) => handleButtonClick('button8', interaction));

        await interaction.editReply({ embeds: [embed], components: [firstButtonRow, secondButtonRow] });
    },
};
