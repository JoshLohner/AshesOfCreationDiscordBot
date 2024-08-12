// createpartycommand.js

module.exports = {
    name: 'createparty',
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply('Testing -createparty-');
    },
};
