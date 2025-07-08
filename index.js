// =============================================
// index.js CLEAN & STABLE - IMC-MetaBot7032
// =============================================
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');

// =============================================
// Initialisation du client avec intents minimalistes
// =============================================
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// =============================================
// Chargement dynamique des commandes
// =============================================
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Commande chargée : ${command.data.name}`);
    } else {
        console.log(`❌ La commande ${file} est invalide (manque 'data' ou 'execute').`);
    }
}

// =============================================
// Event prêt
// =============================================
client.once(Events.ClientReady, c => {
    console.log(`✅ Connecté en tant que ${c.user.tag}`);
});

// =============================================
// Gestion des interactions avec protection complète
// =============================================
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ Commande ${interaction.commandName} introuvable.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Erreur lors de l'exécution de la commande ${interaction.commandName} :`, error);

        try {
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Une erreur est survenue lors de l\'exécution de la commande.' });
            } else if (!interaction.replied) {
                await interaction.reply({ content: '❌ Une erreur est survenue lors de l\'exécution de la commande.', ephemeral: true });
            } else {
                console.error('❌ Impossible de répondre : interaction déjà terminée.');
            }
        } catch (followUpError) {
            console.error('❌ Erreur lors de la tentative de réponse après échec :', followUpError);
        }
    }
});

// =============================================
// Connexion du bot
// =============================================
client.login(process.env.TOKEN).catch(err => {
    console.error('❌ Erreur lors de la connexion du bot :', err);
});
