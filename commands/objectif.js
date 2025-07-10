// 📂 commands/objectif.js

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('objectif')
        .setDescription('Définis ton objectif : perte de poids, prise de masse, maintien.')
        .addStringOption(option =>
            option.setName('objectif')
                .setDescription('Ton objectif actuel.')
                .setRequired(true)
                .addChoices(
                    { name: 'Perte de poids', value: 'perte de poids' },
                    { name: 'Prise de masse', value: 'prise de masse' },
                    { name: 'Maintien', value: 'maintien' }
                )),
    async execute(interaction) {
        try {
            console.log('✅ Commande /objectif reçue.');

            await interaction.deferReply();

            const obj = interaction.options.getString('objectif');

            const objectifEmbed = new EmbedBuilder()
                .setColor('#36D6B5')
                .setTitle('🎯 Objectif enregistré')
                .setDescription(`Ton objectif **${obj}** a été enregistré avec succès.`)
                .setFooter({ text: 'Healthy&Co • Suivi personnalisé' })
                .setTimestamp();

            await interaction.editReply({ embeds: [objectifEmbed] });

            console.log(`✅ Objectif enregistré : ${obj}`);
        } catch (error) {
            console.error('❌ Erreur dans la commande /objectif :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors de l\'enregistrement de ton objectif.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors de l\'enregistrement de ton objectif.', ephemeral: true });
            }
        }
    },
};
