// createeventcommand.js

module.exports = {
    name: 'createraidpvp',
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply('Testing -createraidpvp-');
    },
};
