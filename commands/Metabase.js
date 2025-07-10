// 📂 commands/metabase.js

const { SlashCommandBuilder } = require('discord.js');
const { calculerTDEE } = require('../utils/calculTDEE');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metabase')
        .setDescription('Calcule ton Métabolisme de Base (MB) et tes besoins caloriques journaliers.')
        .addNumberOption(option =>
            option.setName('poids').setDescription('Ton poids en kg').setRequired(true))
        .addNumberOption(option =>
            option.setName('taille').setDescription('Ta taille en cm').setRequired(true))
        .addIntegerOption(option =>
            option.setName('age').setDescription('Ton âge en années').setRequired(true))
        .addStringOption(option =>
            option.setName('sexe')
                .setDescription('Ton sexe')
                .setRequired(true)
                .addChoices(
                    { name: 'Homme', value: 'homme' },
                    { name: 'Femme', value: 'femme' }
                ))
        .addStringOption(option =>
            option.setName('activite')
                .setDescription('Ton niveau d\'activité physique')
                .setRequired(true)
                .addChoices(
                    { name: 'Faible', value: 'faible' },
                    { name: 'Modérée', value: 'moderee' },
                    { name: 'Élevée', value: 'elevee' },
                    { name: 'Très élevée', value: 'tres_elevee' }
                )),
    async execute(interaction) {
        try {
            console.log('✅ Commande /metabase reçue.');

            await interaction.deferReply();

            const { embed } = calculerTDEE(interaction);
            await interaction.editReply({ embeds: [embed] });

            console.log('✅ Résultat metabase envoyé.');
        } catch (error) {
            console.error('❌ Erreur dans la commande /metabase :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors du calcul metabase.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors du calcul metabase.', ephemeral: true });
            }
        }
    },
};
