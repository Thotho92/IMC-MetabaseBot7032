const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const questions = require('../questions/questions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quizz')
        .setDescription('Lance un quiz nutrition sur Healthy&Co.'),

    async execute(interaction) {
        try {
            console.log('✅ Commande /quizz reçue, préparation de l\'embed.');

            await interaction.deferReply();

            const question = questions[Math.floor(Math.random() * questions.length)];

            const quizEmbed = new EmbedBuilder()
                .setColor('#00FF99')
                .setTitle(`🥑 Quiz Nutrition Healthy&Co`)
                .setDescription(`**${question.question}**`)
                .addFields(
                    { name: 'A️⃣', value: question.options[0], inline: true },
                    { name: 'B️⃣', value: question.options[1], inline: true },
                    { name: 'C️⃣', value: question.options[2], inline: true },
                    { name: 'D️⃣', value: question.options[3], inline: true }
                )
                .setFooter({ text: 'Réponds en envoyant A, B, C ou D dans le chat pour t\'entraîner.' });

            await interaction.editReply({ embeds: [quizEmbed] });

            console.log('✅ Embed Quiz envoyé.');
        } catch (error) {
            console.error('❌ Erreur dans la commande /quizz :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors du lancement du quiz.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors du lancement du quiz.', ephemeral: true });
            }
        }
    },
};
