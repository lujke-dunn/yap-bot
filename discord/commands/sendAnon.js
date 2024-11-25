const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anon')
        .setDescription('Send an anonymous message to a channel')
        .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)),
    
    async execute(interaction) {
        const message = interaction.options.getString('message');

        try {
            await interaction.reply({ content: 'Message sent anonymously.', ephemeral: true });
            await interaction.channel.send({ content: `Anonymous: ${message}` });
        } catch (error) {
            console.error('Error sending anonymous message:', error);
            await interaction.reply({ content: 'An error occurred while sending the anonymous message.', ephemeral: true });
        }
    }
};

