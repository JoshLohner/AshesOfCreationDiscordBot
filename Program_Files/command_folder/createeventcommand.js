const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { registerButtonHandler } = require('../helper_folder/button_handler');

const buttonClickData = {
    button1: new Set(),
    button2: new Set(),
    button3: new Set(),
    button4: new Set(),
    button5: new Set(),
    button6: new Set(),
    button7: new Set(),
    button8: new Set()
};

module.exports = {
    name: 'createvent',
    async execute(interaction) {
        await interaction.deferReply();

        const event_name = interaction.options.getString('event_name');
        const gameplayType = interaction.options.getString('gameplay_type');
        const description = interaction.options.getString('description') || 'No description provided';
        const requirements = interaction.options.getString('requirements') || 'No requirements specified';

        let embed = new EmbedBuilder()
            .setTitle(`Event: ${event_name}`)
            .setDescription('Event Created')
            .setColor(0x00AE86)
            .addFields(
                { name: 'Description', value: description },
                { name: 'Gameplay_Type', value: gameplayType, inline: true },
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

        const controlButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('close_party').setLabel('Close').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('mention_participants').setLabel('Mention Participants').setStyle(ButtonStyle.Secondary)
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

            let signUpDetails = '';
            let totalCount = 0;

            for (const [buttonId, users] of Object.entries(buttonClickData)) {
                const userCount = users.size;
                if (userCount > 0) {
                    signUpDetails += `${roleNames[buttonId]}: ${userCount} participants\n`;
                    totalCount += userCount;
                }
            }

            signUpDetails += `\n**Total Participants:** ${totalCount}`;

            embed.spliceFields(4, embed.data.fields.length - 4);
            embed.addFields({ name: 'Sign Ups:', value: signUpDetails || 'No interactions yet', inline: false });
        };

        const handleButtonClick = async (buttonId, interaction) => {
            const user = interaction.user;

            if (buttonClickData[buttonId].has(user.id)) {
                buttonClickData[buttonId].delete(user.id);
            } else {
                for (const users of Object.values(buttonClickData)) {
                    users.delete(user.id);
                }
                buttonClickData[buttonId].add(user.id);
            }

            updateEmbedWithUserClicks();
            await interaction.update({ embeds: [embed] });
        };

        const handleCloseButtonClick = async (interaction) => {
            if (interaction.user.id !== interaction.user.id) {
                await interaction.reply({ content: 'Only the creator of this command can close it.', ephemeral: true });
                return;
            }

            firstButtonRow.components.forEach(button => button.setDisabled(true));
            secondButtonRow.components.forEach(button => button.setDisabled(true));
            controlButtonRow.components.forEach(button => button.setDisabled(true));

            embed.setDescription('Event Closed');

            await interaction.update({ embeds: [embed], components: [firstButtonRow, secondButtonRow, controlButtonRow] });
        };

        const handleMentionParticipantsClick = async (interaction) => {
            let mentions = '';

            for (const users of Object.values(buttonClickData)) {
                users.forEach(userId => {
                    mentions += `<@${userId}> `;
                });
            }

            if (mentions) {
                await interaction.reply({ content: `EVENT MESSAGE: ${mentions}`, ephemeral: false });
            } else {
                await interaction.reply({ content: 'No participants have signed up yet.', ephemeral: true });
            }
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
        registerButtonHandler('mention_participants', (interaction) => handleMentionParticipantsClick(interaction));

        const message = await interaction.editReply({ embeds: [embed], components: [firstButtonRow, secondButtonRow, controlButtonRow] });

        setTimeout(async () => {
            try {
                await message.delete();
            } catch (error) {
                console.error('Failed to delete the message:', error);
            }
        }, 7 * 24 * 60 * 60 * 1000); // 1 week in milliseconds
    },
};
