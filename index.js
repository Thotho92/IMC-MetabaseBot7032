require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'imc') {
        const poids = options.getNumber('poids');
        const taille = options.getNumber('taille') / 100;
        const imc = poids / (taille * taille);

        let interpretation = '';
        if (imc < 18.5) {
            interpretation = "Insuffisance pondérale";
        } else if (imc < 25) {
            interpretation = "Corpulence normale";
        } else if (imc < 30) {
            interpretation = "Surpoids";
        } else {
            interpretation = "Obésité";
        }

        const embed = new EmbedBuilder()
            .setColor(0x00bfff)
            .setTitle('𓂀 Résultat de ton IMC')
            .addFields(
                { name: '📊 IMC', value: `${imc.toFixed(1)}`, inline: true },
                { name: '📋 Interprétation', value: interpretation, inline: true },
                { name: '💡 Conseil', value: "Continue ton rythme alimentaire et ton activité physique si ton IMC est normal, sinon ajuste en conséquence." },
                { name: '📌 Formule', value: 'Poids (kg) ÷ Taille² (m²)\nHealthyBot • Calcul direct dans Discord' },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'metabase') {
        const poids = options.getNumber('poids');
        const taille = options.getNumber('taille');
        const age = options.getNumber('age');
        const sexe = options.getString('sexe');
        const activite = options.getString('activite');

        let mb = 0;
        if (sexe === 'homme') {
            mb = 10 * poids + 6.25 * taille - 5 * age + 5;
        } else {
            mb = 10 * poids + 6.25 * taille - 5 * age - 161;
        }

        let facteurActivite = 1.2;
        if (activite === 'leger') facteurActivite = 1.375;
        else if (activite === 'modere') facteurActivite = 1.55;
        else if (activite === 'eleve') facteurActivite = 1.725;
        else if (activite === 'tres_eleve') facteurActivite = 1.9;

        const tdee = mb * facteurActivite;

        const embed = new EmbedBuilder()
            .setColor(0xff8c00)
            .setTitle('🔥 Résultat de ton Métabolisme de Base')
            .addFields(
                { name: '🩺 MB (au repos)', value: `${Math.round(mb)} kcal/jour`, inline: true },
                { name: '🏃‍♂️ TDEE (activité incluse)', value: `${Math.round(tdee)} kcal/jour`, inline: true },
                { name: '📌 Formule utilisée', value: `Mifflin-St Jeor\nHomme : (10 × poids) + (6.25 × taille) – (5 × âge) + 5\nFemme : (10 × poids) + (6.25 × taille) – (5 × âge) – 161\nMultiplié par le facteur d'activité` },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'objectif') {
        const objectif = options.getString('objectif');
        let titre = "";
        let conseil = "";
        let couleur = 0x00ff00;

        if (objectif === 'perte') {
            titre = "🔻 Objectif : Perte de poids";
            conseil = "📉 Vise un déficit de ~300 kcal/jour, consomme 1,6–2 g de protéines/kg de poids de corps, augmente ton activité physique (marche, muscu, HIIT) pour préserver la masse musculaire.";
            couleur = 0xff4d4d;
        } else if (objectif === 'prise') {
            titre = "💪 Objectif : Prise de muscle";
            conseil = "🍽️ Vise un surplus de 200–300 kcal/jour, consomme 1,6–2 g de protéines/kg de poids de corps, priorise l'entraînement de force 3-4x/semaine, privilégie les glucides complexes et le repos.";
            couleur = 0x4caf50;
        } else if (objectif === 'maintien') {
            titre = "⚖️ Objectif : Maintien";
            conseil = "⚖️ Maintiens ton apport calorique à ton TDEE, reste actif quotidiennement, assure un apport suffisant en protéines (~1,2–1,6 g/kg), en fruits/légumes, et surveille ton poids chaque semaine pour ajuster si besoin.";
            couleur = 0x00bfff;
        } else {
            titre = "❓ Objectif non reconnu";
            conseil = "Merci de spécifier un objectif valide : perte, prise ou maintien.";
            couleur = 0xffff00;
        }

        const embed = new EmbedBuilder()
            .setColor(couleur)
            .setTitle(titre)
            .setDescription(conseil)
            .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
