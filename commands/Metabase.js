const { SlashCommandBuilder } = require('discord.js');
const { calculerTDEE } = require('../utils/calculTDEE');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metabase')
        .setDescription('Calcule ton MB et tes besoins caloriques journaliers.')
        .addNumberOption(opt => opt.setName('poids').setDescription('Poids en kg').setRequired(true))
        .addNumberOption(opt => opt.setName('taille').setDescription('Taille en cm').setRequired(true))
        .addIntegerOption(opt => opt.setName('age').setDescription('Âge').setRequired(true))
        .addStringOption(opt => opt.setName('sexe').setDescription('Sexe').setRequired(true)
            .addChoices({ name: 'Homme', value: 'homme' }, { name: 'Femme', value: 'femme' }))
        .addStringOption(opt => opt.setName('activite').setDescription('Niveau d\'activité').setRequired(true)
            .addChoices(
                { name: 'Faible', value: 'faible' },
                { name: 'Modérée', value: 'moderee' },
                { name: 'Élevée', value: 'elevee' },
                { name: 'Très élevée', value: 'tres_elevee' }
            )),

    async execute(interaction) {
        try {
            console.log('✅ /metabase exécutée');
            await interaction.deferReply({ ephemeral: false });
            const { embed } = calculerTDEE(interaction);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('❌ Erreur /metabase :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Merci de fournir toutes les informations demandées.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Merci de fournir toutes les informations demandées.', ephemeral: true });
            }
        }
    },
};