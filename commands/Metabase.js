const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('metabase')
        .setDescription("Calcule ton Métabolisme de Base (MB) et ton TDEE")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Ton poids en kg')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('taille')
                .setDescription('Ta taille en cm')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('age')
                .setDescription('Ton âge en années')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sexe')
                .setDescription('Ton sexe')
                .setRequired(true)
                .addChoices(
                    { name: "Homme", value: "homme" },
                    { name: "Femme", value: "femme" }
                )
        )
        .addStringOption(option =>
            option.setName('activite')
                .setDescription("Ton niveau d'activité")
                .setRequired(true)
                .addChoices(
                    { name: "Sédentaire", value: "sedentaire" },
                    { name: "Peu actif", value: "peu_actif" },
                    { name: "Actif", value: "actif" },
                    { name: "Très actif", value: "tres_actif" }
                )
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille');
        const age = interaction.options.getNumber('age');
        const sexe = interaction.options.getString('sexe');
        const activite = interaction.options.getString('activite');

        const mb = (sexe === 'homme')
            ? 10 * poids + 6.25 * taille - 5 * age + 5
            : 10 * poids + 6.25 * taille - 5 * age - 161;

        let facteurActivite = 1.2;
        if (activite === 'peu_actif') facteurActivite = 1.375;
        else if (activite === 'actif') facteurActivite = 1.55;
        else if (activite === 'tres_actif') facteurActivite = 1.725;

        const tdee = Math.round(mb * facteurActivite);

        const embed = new EmbedBuilder()
            .setColor(0xff8c00)
            .setTitle('🔥 Ton Métabolisme & TDEE')
            .setThumbnail('https://i.imgur.com/Z1sUkBR.png')
            .addFields(
                { name: '🩺 MB (repos)', value: `**${Math.round(mb)} kcal/j**`, inline: true },
                { name: '🏃‍♂️ TDEE (activité)', value: `**${tdee} kcal/j**`, inline: true },
                { name: '💡 Conseil Healthy&Co', value: "Utilise ces valeurs comme base pour gérer ton objectif de poids ou de prise de muscle de façon adaptée." }
            )
            .setFooter({ text: 'Healthy&Co | IMC-MetaBot7032' })
            .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
    }
};
