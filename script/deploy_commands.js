// 📂 script/deploy_commands.js

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`✅ Début du refresh ${commands.length} commande(s) (/) sur Discord.`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Commandes déployées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors du déploiement des commandes :', error);
    }
})();
