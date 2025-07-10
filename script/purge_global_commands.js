// purge_global_commands.js

const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🧹 Suppression des commandes GLOBAL...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );
        console.log('✅ Toutes les commandes GLOBAL ont été supprimées.');
    } catch (error) {
        console.error(error);
    }
})();
