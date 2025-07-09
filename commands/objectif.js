const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('objectif')
        .setDescription('Définis ton objectif (perte de poids, prise de masse, maintien).')
        .addStringOption(option =>
            option.setName('objectif')
                .setDescription('Choisis ton objectif')
                .setRequired(true)
                .addChoices(
                    { name: 'Perte de poids', value: 'perte' },
                    { name: 'Prise de masse', value: 'prise' },
                    { name: 'Maintien', value: 'maintien' }
                )
        ),

    async execute(interaction) {
        console.log('✅ Commande /objectif reçue');

        try {
            const obj = interaction.options.getString('objectif');
            console.log('✅ Option objectif récupérée :', obj);

            await interaction.reply({ content: `🎯 Ton objectif **${obj}** a bien été enregistré.`, ephemeral: false });

        } catch (error) {
            console.error('❌ Erreur dans la commande /objectif :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: `❌ Une erreur est survenue lors de l'enregistrement de ton objectif.`, ephemeral: true });

            } else {
                await interaction.reply({ content: `❌ Une erreur est survenue lors de l'enregistrement de ton objectif.`, ephemeral: true });

            }
        }
    }
};

