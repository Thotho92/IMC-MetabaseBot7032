const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();

// Créer un tableau vide pour stocker les commandes
const commands = [];

// Lire tous les fichiers .js dans le dossier /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Charger chaque commande et push son .data en JSON
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Commande prête pour déploiement : ${command.data.name}`);
    } else {
        console.warn(`⚠️ La commande ${file} est invalide (manque 'data' ou 'execute').`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("✅ Déploiement des commandes slash en cours...");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log("✅ Commandes slash déployées sur la guilde avec succès.");
    } catch (error) {
        console.error("❌ Erreur lors du déploiement :", error);
    }
})();
