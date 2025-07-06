const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
} = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "imc") {
        const poids = interaction.options.getNumber("poids");
        const taille_cm = interaction.options.getNumber("taille");
        const taille_m = taille_cm / 100;

        const imc = poids / (taille_m * taille_m);
        let interpretation = "";
        if (imc < 18.5) interpretation = "🚩 Insuffisance pondérale";
        else if (imc < 25) interpretation = "✅ Normal";
        else if (imc < 30) interpretation = "⚠️ Surpoids";
        else interpretation = "🚩 Obésité";

        const imcEmbed = new EmbedBuilder()
            .setColor("#00bfa5")
            .setTitle("📊 Résultat de ton IMC")
            .addFields(
                {
                    name: "🧮 Ton IMC",
                    value: `${imc.toFixed(1)}`,
                    inline: true,
                },
                {
                    name: "📌 Interprétation",
                    value: interpretation,
                    inline: true,
                },
                {
                    name: "📏 Formule utilisée",
                    value: "Poids (kg) ÷ Taille² (m²)",
                },
            )
            .setFooter({ text: "HealthyBot • Calcul direct dans Discord" });

        await interaction.reply({ embeds: [imcEmbed] });
    }

    if (interaction.commandName === "metabase") {
        const poids = interaction.options.getNumber("poids");
        const taille = interaction.options.getNumber("taille");
        const age = interaction.options.getInteger("age");
        const sexe = interaction.options.getString("sexe");
        const activite = parseFloat(interaction.options.getString("activite"));

        let mb;
        if (sexe === "homme") {
            mb = 10 * poids + 6.25 * taille - 5 * age + 5;
        } else if (sexe === "femme") {
            mb = 10 * poids + 6.25 * taille - 5 * age - 161;
        } else {
            return await interaction.reply("❌ Erreur : sexe invalide.");
        }

        const tdee = mb * activite;

        const metaEmbed = new EmbedBuilder()
            .setColor("#ff6f00")
            .setTitle("🔥 Résultat de ton Métabolisme de Base")
            .addFields(
                {
                    name: "🩺 MB (au repos)",
                    value: `${Math.round(mb)} kcal/jour`,
                    inline: true,
                },
                {
                    name: "🏃‍♂️ TDEE (activité incluse)",
                    value: `${Math.round(tdee)} kcal/jour`,
                    inline: true,
                },
                {
                    name: "📌 Formule utilisée",
                    value: `Mifflin-St Jeor\nHomme: (10 × poids) + (6.25 × taille) - (5 × âge) + 5\nFemme: (10 × poids) + (6.25 × taille) - (5 × âge) - 161\nMultiplié par facteur activité`,
                },
            )
            .setFooter({ text: "HealthyBot • Calcul direct dans Discord" });

        await interaction.reply({ embeds: [metaEmbed] });
    }
});

// Anti crash pour Railway / Replit
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(process.env.TOKEN);
