const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
    console.log("✅ Bot connecté, prêt à écouter les commandes.");

    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "imc") {
        const imcEmbed = new EmbedBuilder()
            .setColor("#00bfa5")
            .setTitle("🧮 Calcul de ton IMC")
            .setDescription(
                "L'IMC (Indice de Masse Corporelle) évalue si ton poids est adapté à ta taille. Un outil simple pour suivre ton état de forme et ajuster tes objectifs santé ou performance.",
            )
            .addFields(
                {
                    name: "📏 Comment est-il calculé ?",
                    value: "Poids (kg) ÷ Taille² (m²)\nEx : 75 kg ÷ (1,78 x 1,78) = 23,7",
                },
                {
                    name: "🔍 Interprétation",
                    value: "✅ 18,5 – 24,9 : Normal\n⚠️ 25 – 29,9 : Surpoids\n🚩 30+ : Obésité",
                },
                {
                    name: "🔗 Lien utile",
                    value: "[Calculer mon IMC en ligne](https://www.calculersonimc.fr/)",
                },
            )
            .setFooter({
                text: "HealthyBot • Analyse ton état de forme",
                iconURL: client.user.displayAvatarURL(),
            });

        await interaction.reply({ embeds: [imcEmbed] });
    }

    if (interaction.commandName === "metabase") {
        const metaEmbed = new EmbedBuilder()
            .setColor("#ff6f00")
            .setTitle("🔥 Calcul de ton Métabolisme de Base")
            .setDescription(
                "Le Métabolisme de Base (MB) correspond aux calories dépensées par ton corps au repos pour maintenir ses fonctions vitales. Connaître ton MB t’aide à planifier tes apports pour tes objectifs santé ou performance.",
            )
            .addFields(
                {
                    name: "📏 Comment est-il estimé ?",
                    value: "**Formule de Mifflin-St Jeor :**\n- Homme : (10 x poids) + (6,25 x taille) – (5 x âge) + 5\n- Femme : (10 x poids) + (6,25 x taille) – (5 x âge) – 161",
                },
                {
                    name: "💡 Pourquoi c’est important ?",
                    value: "👉 Savoir combien tu brûles au repos t'aide à planifier ta diète, éviter les erreurs de déficit ou d'excès et optimiser tes performances.",
                },
                {
                    name: "🔗 Lien utile",
                    value: "[Calculer mon MB en ligne](https://www.calculersonimc.fr/metabolisme-de-base/)",
                },
            )
            .setFooter({
                text: "HealthyBot • Optimise tes objectifs",
                iconURL: client.user.displayAvatarURL(),
            });

        await interaction.reply({ embeds: [metaEmbed] });
    }
});
console.log("✅ IMC-MetabaseBot: Script lancé, en attente de connexion...");

console.log("🚀 Lancement du bot IMC-MetabaseBot...");
console.log("✅ Token récupéré :", process.env.TOKEN ? "Oui" : "Non");
process.on('uncaughtException', (err) => {
    console.error('🚨 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

client
    console.log("📡 Tentative de connexion avec le token : ", process.env.TOKEN ? "Présent" : "Absent");

    .login(process.env.TOKEN)
    .catch((err) => console.error("❌ Erreur de connexion Discord :", err));
process.stdin.resume(); // Empêche le process de se fermer sur Railway
