const buttonHandlers = new Map();

function registerButtonHandler(customId, handler) {
    buttonHandlers.set(customId, handler);
}

async function handleButtonInteraction(interaction) {
    const handler = buttonHandlers.get(interaction.customId);

    if (handler) {
        try {
            await handler(interaction);
        } catch (error) {
            console.error(`Error handling button ${interaction.customId}:`, error);
            await interaction.reply({ content: 'There was an error handling this button interaction.', ephemeral: true });
        }
    } else {
        console.log(`Unknown button: ${interaction.customId}`);
        await interaction.reply({ content: 'Unknown button clicked.', ephemeral: true });
    }
}

module.exports = { registerButtonHandler, handleButtonInteraction };
