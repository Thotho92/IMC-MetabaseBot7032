const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const questions = require('../questions/questions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quizz')
    .setDescription('Lance un quizz nutrition sur Healthy&Co.'),

  async execute(interaction) {
    const question = questions[Math.floor(Math.random() * questions.length)];

    const embed = new EmbedBuilder()
      .setTitle('🍏 Quizz Nutrition')
      .setDescription(`**${question.question}**\n\n${question.options.join('\n')}`)
      .setColor('Green');

    await interaction.reply({ embeds: [embed] });

    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', m => {
      if (m.content.toUpperCase() === question.bonneReponse) {
        m.reply('✅ Bonne réponse, bien joué !');
      } else {
        m.reply(`❌ Mauvaise réponse. La bonne réponse était **${question.bonneReponse}**.`);
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp('⏱️ Temps écoulé, pas de réponse enregistrée.');
      }
    });
  },
};