// createeventcommand.js

module.exports = {
    name: 'createraidpve',
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.editReply('Testing -createraidpve-');
    },
};
