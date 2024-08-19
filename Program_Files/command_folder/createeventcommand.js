// createeventcommand.js

module.exports = {
    name: 'createevent',
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply('Testing -createevent-');
    },
};
