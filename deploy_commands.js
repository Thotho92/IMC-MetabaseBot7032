const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('imc')
        .setDescription('Calcule ton Indice de Masse Corporelle (IMC)'),
    new SlashCommandBuilder()
        .setName('metabase')
        .setDescription('Calcule ton Métabolisme de Base (MB)')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🚀 Déploiement des commandes slash en cours...');
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            console.log('✅ Commandes slash déployées sur la guilde avec succès.');
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log('✅ Commandes slash globales déployées avec succès.');
        }
    } catch (error) {
        console.error(error);
    }
})();
