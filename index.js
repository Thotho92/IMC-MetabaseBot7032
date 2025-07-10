// index.js unique et complet pour ton bot Discord avec IMC et Métabase uniquement

const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'imc') {
        await interaction.deferReply();
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille');
        const tailleEnMetres = taille / 100;
        const imc = poids / (tailleEnMetres * tailleEnMetres);
        let interpretation =
            imc < 18.5 ? 'Insuffisance pondérale' :
            imc < 25 ? 'Corpulence normale' :
            imc < 30 ? 'Surpoids' :
            imc < 35 ? 'Obésité modérée' :
            imc < 40 ? 'Obésité sévère' : 'Obésité morbide';

        const embed = new EmbedBuilder()
            .setColor('#36D6B5')
            .setTitle('📊 Résultat IMC')
            .addFields(
                { name: 'IMC', value: imc.toFixed(2), inline: true },
                { name: 'Interprétation', value: interpretation, inline: true }
            )
            .setFooter({ text: 'Healthy&Co • Calcul IMC' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }

    if (interaction.commandName === 'metabase') {
        await interaction.deferReply();
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille');
        const age = interaction.options.getInteger('age');
        const sexe = interaction.options.getString('sexe');
        const activite = interaction.options.getString('activite');

        let mb = sexe === 'homme'
            ? 10 * poids + 6.25 * taille - 5 * age + 5
            : 10 * poids + 6.25 * taille - 5 * age - 161;

        const facteurs = {
            'faible': 1.2,
            'moderee': 1.375,
            'elevee': 1.55,
            'tres_elevee': 1.725
        };

        const tdee = Math.round(mb * facteurs[activite]);

        const embed = new EmbedBuilder()
            .setColor('#36D6B5')
            .setTitle('🔥 Résultat TDEE')
            .addFields(
                { name: 'Métabolisme de Base (MB)', value: `${Math.round(mb)} kcal/jour`, inline: true },
                { name: 'Activité', value: activite.replace('_', ' '), inline: true },
                { name: 'TDEE', value: `${tdee} kcal/jour` }
            )
            .setFooter({ text: 'Healthy&Co • Calcul TDEE' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
});

// Enregistrement des commandes
const commands = [
    new SlashCommandBuilder()
        .setName('imc')
        .setDescription('Calcule ton IMC.')
        .addNumberOption(option => option.setName('poids').setDescription('Poids en kg').setRequired(true))
        .addNumberOption(option => option.setName('taille').setDescription('Taille en cm').setRequired(true)),

    new SlashCommandBuilder()
        .setName('metabase')
        .setDescription('Calcule ton MB et TDEE.')
        .addNumberOption(option => option.setName('poids').setDescription('Poids en kg').setRequired(true))
        .addNumberOption(option => option.setName('taille').setDescription('Taille en cm').setRequired(true))
        .addIntegerOption(option => option.setName('age').setDescription('Âge').setRequired(true))
        .addStringOption(option => option.setName('sexe').setDescription('Sexe').addChoices(
            { name: 'Homme', value: 'homme' },
            { name: 'Femme', value: 'femme' }
        ).setRequired(true))
        .addStringOption(option => option.setName('activite').setDescription('Niveau d\'activité').addChoices(
            { name: 'Faible', value: 'faible' },
            { name: 'Modérée', value: 'moderee' },
            { name: 'Élevée', value: 'elevee' },
            { name: 'Très élevée', value: 'tres_elevee' }
        ).setRequired(true))
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🛠️ Déploiement des commandes...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('✅ Commandes enregistrées avec succès.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.TOKEN);

