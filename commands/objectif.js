const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('objectif')
        .setDescription("Définis ton objectif (perte de poids, prise de muscle, maintien) et reçois conseils")
        .addStringOption(option =>
            option.setName('objectif')
                .setDescription("Choisis ton objectif")
                .setRequired(true)
                .addChoices(
                    { name: "Perte de poids", value: "perte" },
                    { name: "Prise de muscle", value: "prise" },
                    { name: "Maintien", value: "maintien" },
                )
        ),

    async execute(interaction) {
        console.log('✅ Commande /objectif reçue');

        const obj = interaction.options.getString('objectif');
        console.log('✅ Option objectif récupérée :', obj);

        let titre, conseil;
        switch (obj) {
            case 'perte':
                titre = '🔻 Objectif : Perte de poids';
                conseil = "Crée un déficit calorique modéré (~300 kcal/jour), maintiens un apport en protéines suffisant et reste actif quotidiennement pour préserver ta masse musculaire.";
                break;
            case 'prise':
                titre = '💪 Objectif : Prise de muscle';
                conseil = "Crée un léger surplus calorique (~200–300 kcal/jour), entraîne-toi en force 3-4 fois par semaine, dors suffisamment et reste régulier pour construire de la masse musculaire.";
                break;
            case 'maintien':
                titre = '⚖️ Objectif : Maintien';
                conseil = "Reste proche de ton TDEE en calories, reste actif chaque jour et ajuste ton apport si nécessaire pour maintenir ton poids de forme.";
                break;
            default:
                titre = '❌ Objectif invalide';
                conseil = "Merci de sélectionner un objectif valide : perte, prise ou maintien.";
                console.log('❌ Valeur inattendue de obj :', obj);
                break;
        }

        const embed = new EmbedBuilder()
            .setColor(0x00bfff)
            .setTitle(titre)
            .setThumbnail('https://i.imgur.com/Z1sUkBR.png')
            .addFields(
                { name: '💡 Conseil Healthy&Co', value: conseil }
            )
            .setFooter({ text: 'Healthy&Co | IMC-MetaBot7032' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        console.log('✅ Réponse envoyée pour /objectif');
    }
};
