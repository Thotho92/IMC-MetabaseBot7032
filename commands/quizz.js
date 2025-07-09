// 📂 commands/quizz.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const questions = require('../questions/questions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quizz')
        .setDescription('Lance un quiz nutrition sur Healthy&Co.'),

    async execute(interaction) {
        try {
            console.log("✅ Commande /quizz reçue, préparation de l'embed.");

            await interaction.deferReply();

            // Sélection aléatoire d'une question
            const question = questions[Math.floor(Math.random() * questions.length)];

            const quizEmbed = new EmbedBuilder()
                .setColor('#00FF99')
                .setTitle('🥑 Quiz Nutrition Healthy&Co')
                .setDescription(`**${question.question}**`)
                .addFields(
                    { name: '🇦', value: question.options[0], inline: true },
                    { name: '🇧', value: question.options[1], inline: true },
                    { name: '🇨', value: question.options[2], inline: true },
                    { name: '🇩', value: question.options[3], inline: true }
                )
                .setFooter({ text: 'Réponds en envoyant A, B, C ou D dans les 30 secondes.' });

            await interaction.editReply({ embeds: [quizEmbed] });

            const filter = m => m.author.id === interaction.user.id && ['A', 'B', 'C', 'D'].includes(m.content.toUpperCase());
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', collected => {
                const userAnswer = collected.content.toUpperCase();
                const correctAnswer = question.answer.toUpperCase();

                if (userAnswer === correctAnswer) {
                    collected.reply('✅ Bonne réponse ! Tu maîtrises bien tes bases de nutrition.');
                } else {
                    collected.reply(`❌ Mauvaise réponse. La bonne réponse était **${correctAnswer}**.`);
                }
                console.log(`✅ Réponse collectée : ${userAnswer}`);
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp('⏰ Temps écoulé, aucune réponse reçue. Essaie à nouveau plus tard.');
                    console.log('⌛ Aucun message reçu dans le délai imparti.');
                }
            });

        } catch (error) {
            console.error('❌ Erreur dans la commande /quizz :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors du lancement du quiz.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors du lancement du quiz.', ephemeral: true });
            }
        }
    }
};
