const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows information about Be Yapper commands'),
    
    async execute(interaction) {
        await interaction.reply({
            content: 'Available commands:\n' +
                     '`/help` - Shows this help message\n' +
                     '`/be-yapper` - Gives you the yapper role\n' + 
                     '`/anon` - Sends an anonymous message to the current channel',
            ephemeral: true
        });
    }
};
