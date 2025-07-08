const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imc')
        .setDescription("Calcule ton Indice de Masse Corporelle (IMC)")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Ton poids en kg')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('taille')
                .setDescription('Ta taille en cm')
                .setRequired(true)
        ),

    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille') / 100;
        const imc = poids / (taille * taille);

        let interpretation, conseil;
        if (imc < 18.5) {
            interpretation = "Insuffisance pondérale";
            conseil = "Augmente ton apport calorique progressivement et veille à ton apport en protéines.";
        } else if (imc < 25) {
            interpretation = "Corpulence normale";
            conseil = "Maintiens ton rythme alimentaire équilibré et ton activité physique.";
        } else if (imc < 30) {
            interpretation = "Surpoids";
            conseil = "Considère un léger déficit calorique et augmente ton activité physique.";
        } else {
            interpretation = "Obésité";
            conseil = "Consulte un professionnel de santé et ajuste ton alimentation et ton activité.";
        }

        const embed = new EmbedBuilder()
            .setColor(0x00bfff)
            .setTitle('📊 Résultat de ton IMC')
            .setThumbnail('https://i.imgur.com/Z1sUkBR.png')
            .addFields(
                { name: '💪 IMC Calculé', value: `**${imc.toFixed(1)}**`, inline: true },
                { name: '📋 Interprétation', value: `**${interpretation}**`, inline: true },
                { name: '💡 Conseil Healthy&Co', value: conseil }
            )
            .setFooter({ text: 'Healthy&Co | IMC-MetaBot7032' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
