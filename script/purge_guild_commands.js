// 📂 script/purge_guild_commands.js

const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🧹 Suppression des commandes GUILD...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] },
        );

        console.log('✅ Toutes les commandes GUILD ont été supprimées.');
    } catch (error) {
        console.error('❌ Erreur lors de la suppression des commandes GUILD :', error);
    }
})();
