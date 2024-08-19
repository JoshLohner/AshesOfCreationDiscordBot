const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { registerButtonHandler } = require('../helper_folder/button_handler');

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
                new ButtonBuilder().setCustomId('button1').setLabel('Fighter').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button2').setLabel('Mage').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button3').setLabel('Bard').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button4').setLabel('Rogue').setStyle(ButtonStyle.Primary)
            );

        const secondButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('button5').setLabel('Cleric').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button6').setLabel('Summoner').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button7').setLabel('Ranger').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('button8').setLabel('Tank').setStyle(ButtonStyle.Primary)
            );

        const closeButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_party')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)
            );

        const updateEmbedWithUserClicks = async () => {
            const roleNames = {
                button1: 'Fighter',
                button2: 'Mage',
                button3: 'Bard',
                button4: 'Rogue',
                button5: 'Cleric',
                button6: 'Summoner',
                button7: 'Ranger',
                button8: 'Tank'
            };

            let userClicks = '';
            for (const [buttonId, users] of Object.entries(buttonClickData)) {
                for (const user of users) {
                    const member = await interaction.guild.members.fetch(user.id);
                    const displayName = member.nickname || member.user.username;
                    userClicks += `${displayName} has selected ${roleNames[buttonId]}\n`;
                }
            }

            embed.spliceFields(4, embed.data.fields.length - 4);
            embed.addFields({ name: 'Sign Ups:', value: userClicks || 'No interactions yet', inline: false });
        };

        const handleButtonClick = async (buttonId, interaction) => {
            const user = interaction.user;
            const userIndex = buttonClickData[buttonId].findIndex(u => u.id === user.id);

            if (userIndex !== -1) {
                buttonClickData[buttonId].splice(userIndex, 1);
            } else {
                for (const [id, users] of Object.entries(buttonClickData)) {
                    const idx = users.findIndex(u => u.id === user.id);
                    if (idx !== -1) {
                        users.splice(idx, 1);
                    }
                }
                buttonClickData[buttonId].push({ id: user.id, name: user.username });
            }

            updateEmbedWithUserClicks();
            await interaction.update({ embeds: [embed] });
        };

        const handleCloseButtonClick = async (interaction) => {
            if (interaction.user.id !== interaction.user.id) {
                await interaction.reply({ content: 'Only the creator of this command can close it.', ephemeral: true });
                return;
            }

            // Disable all buttons
            firstButtonRow.components.forEach(button => button.setDisabled(true));
            secondButtonRow.components.forEach(button => button.setDisabled(true));
            closeButtonRow.components.forEach(button => button.setDisabled(true));

            embed.setDescription('Party Finder Closed');

            await interaction.update({ embeds: [embed], components: [firstButtonRow, secondButtonRow, closeButtonRow] });
        };

        registerButtonHandler('button1', (interaction) => handleButtonClick('button1', interaction));
        registerButtonHandler('button2', (interaction) => handleButtonClick('button2', interaction));
        registerButtonHandler('button3', (interaction) => handleButtonClick('button3', interaction));
        registerButtonHandler('button4', (interaction) => handleButtonClick('button4', interaction));
        registerButtonHandler('button5', (interaction) => handleButtonClick('button5', interaction));
        registerButtonHandler('button6', (interaction) => handleButtonClick('button6', interaction));
        registerButtonHandler('button7', (interaction) => handleButtonClick('button7', interaction));
        registerButtonHandler('button8', (interaction) => handleButtonClick('button8', interaction));
        registerButtonHandler('close_party', (interaction) => handleCloseButtonClick(interaction));

        const message = await interaction.editReply({ embeds: [embed], components: [firstButtonRow, secondButtonRow, closeButtonRow] });

        // Set timeout to close the party finder after 1 day (24 hours)
        setTimeout(async () => {
            try {
                // Disable all buttons
                firstButtonRow.components.forEach(button => button.setDisabled(true));
                secondButtonRow.components.forEach(button => button.setDisabled(true));
                closeButtonRow.components.forEach(button => button.setDisabled(true));

                embed.setDescription('Party Finder Closed (Timed Out)');

                await message.edit({ embeds: [embed], components: [firstButtonRow, secondButtonRow, closeButtonRow] });
            } catch (error) {
                console.error('Failed to close the party finder:', error);
            }
        }, 24 * 60 * 60 * 1000); // 1 day in milliseconds
    },
};
