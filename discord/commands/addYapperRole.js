const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('be-yapper')
        .setDescription('Subscribe to the yap sessions.'),
    
    async execute(interaction) {
        try {
            let yapperRole = interaction.guild.roles.cache.find(role => role.name === 'Yapper');
            
            if (!yapperRole) {
                yapperRole = await interaction.guild.roles.create({
                    name: 'Yapper',
                    color: '#FF69B4',
                    reason: 'Role for Be Yapper participants'
                });
            }

            if (interaction.member.roles.cache.has(yapperRole.id)) {
                await interaction.member.roles.remove(yapperRole);
                await interaction.reply({
                    content: 'You are no longer a yapper.',
                    ephemeral: true
                })
            } else {
                await interaction.member.roles.add(yapperRole);
                await interaction.reply({
                    content: 'You are now a yapper. You will be notified when it is yap time.',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error managing Yapper role:', error);
            await interaction.reply({
                content: 'Sorry, there was an error while managing the Yapper role. Please make sure the bot has the necessary permissions.',
                ephemeral: true
            });
        }
    }
};
