require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 5000;

async function connectWithRetry(attempt = 1) {
    try {
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        if (error.code === 'ERR_SOCKET_CONNECTION_TIMEOUT' && attempt < MAX_RETRY_ATTEMPTS) {
            console.log(`Connection attempt ${attempt} failed. Retrying in ${RETRY_DELAY/1000} seconds...`);
            setTimeout(() => connectWithRetry(attempt + 1), RETRY_DELAY);
        } else {
            console.error('Failed to connect to Discord:', error);
            process.exit(1);
        }
    }
}

module.exports = { client, connectWithRetry };
