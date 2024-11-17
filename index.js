require('dotenv').config()

const cron = require('node-cron')
const { REST, Routes } = require('discord.js');
const { client, connectWithRetry } = require('./discord/client');
const { getRandomQuestion } = require('./database/getRandomQuestion');
const help = require('./discord/commands/help');
const beYapper = require('./discord/commands/addYapperRole');

const commands = [help.data, beYapper.data];
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Register commands
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Command handling
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = {
        'help': help,
        'be-yapper': beYapper
    }[interaction.commandName];

    if (command) {
        await command.execute(interaction);
    }
});

// Daily question scheduler
cron.schedule('30 23 * * *', async () => {
    try {
        const questionToAsk = await getRandomQuestion();
        
        for (const guild of client.guilds.cache.values()) {
            const targetChannel = guild.channels.cache.find(channel => 
                channel.type === 0 &&
                channel.name.toLowerCase().includes('general') &&
                channel.permissionsFor(guild.members.me).has('SendMessages')
            );
            
            if (targetChannel) {
                await targetChannel.send(`@Yapper Today's question: ${questionToAsk}`);
                console.log(`question sent to ${guild.name} in channel ${targetChannel.name}`);
            }
        }
    } catch (error) {
        console.error('Error sending daily question:', error);
    }
});

client.once('ready', () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Start bot
connectWithRetry();

// Reconnection handling
client.on('disconnect', () => {
    console.log('Bot disconnected! Attempting to reconnect...');
    connectWithRetry();
});