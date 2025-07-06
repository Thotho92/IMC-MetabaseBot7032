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

// === READY ===
client.once(Events.ClientReady, () => {
    console.log("✅ Bot connecté et prêt.");
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// === COMMAND HANDLER ===
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === "imc") {
            const imcEmbed = new EmbedBuilder()
                .setColor("#00bfa5")
                .setTitle("🧮 Calcul de ton IMC")
                .setDescription("L'IMC (Indice de Masse Corporelle) évalue si ton poids est adapté à ta taille.")
                .addFields(
                    { name: "📏 Formule", value: "Poids (kg) ÷ Taille² (m²)" },
                    { name: "🔗 Lien", value: "[Calculer mon IMC](https://www.calculersonimc.fr/)" }
                )
                .setFooter({ text: "HealthyBot - Suivi de forme" });

            await interaction.reply({ embeds: [imcEmbed] });
        }

        if (interaction.commandName === "metabase") {
            const metaEmbed = new EmbedBuilder()
                .setColor("#ff6f00")
                .setTitle("🔥 Calcul de ton Métabolisme de Base")
                .setDescription("Calcule le nombre de calories brûlées au repos (MB) pour optimiser ton plan nutritionnel.")
                .addFields(
                    {
                        name: "📏 Formule (Mifflin-St Jeor)",
                        value: "**Homme** : (10 x poids) + (6.25 x taille) - (5 x âge) + 5\n**Femme** : (10 x poids) + (6.25 x taille) - (5 x âge) - 161",
                    },
                    { name: "🔗 Lien", value: "[Calculer mon MB](https://www.calculersonimc.fr/metabolisme-de-base/)" }
                )
                .setFooter({ text: "HealthyBot - Optimise ton énergie" });

            await interaction.reply({ embeds: [metaEmbed] });
        }
    } catch (error) {
        console.error("🚨 Erreur Interaction:", error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Une erreur est survenue.", ephemeral: true });
        } else {
            await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
        }
    }
});

// === LOGIN ===
client
    .login(process.env.TOKEN)
    .then(() => console.log("✅ Bot connecté à Discord avec succès."))
    .catch((err) => console.error("❌ Erreur de connexion Discord :", err));

// Empêche l'arrêt sur Railway
process.stdin.resume();
