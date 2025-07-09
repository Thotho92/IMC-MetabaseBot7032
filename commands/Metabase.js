const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { calculerTDEE } = require('../utils/calculTDEE');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metabase')
        .setDescription('Calcule ton Métabolisme de Base (MB) et tes besoins caloriques journaliers.'),

    async execute(interaction) {
        try {
            console.log('✅ Commande /metabase reçue');

            await interaction.deferReply();

            const { embed } = calculerTDEE(interaction);

            await interaction.editReply({ embeds: [embed] });

            console.log('✅ Résultat Metabase envoyé.');
        } catch (error) {
            console.error('❌ Erreur dans la commande /metabase :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors du calcul Metabase.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors du calcul Metabase.', ephemeral: true });
            }
        }
    },
};