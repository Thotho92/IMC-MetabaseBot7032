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
            .setDescription("Calcul de l'indice de masse corporelle")
            .addFields(
                { name: "📏 Formule", value: "Poids (kg) ÷ Taille² (m²)" },
                {
                    name: "🔗 Lien",
                    value: "[Calculer mon IMC](https://www.calculersonimc.fr/)",
                },
            );
        await interaction.reply({ embeds: [imcEmbed] });
    }
});

console.log("✅ IMC-MetabaseBot: Script lancé.");
console.log("✅ Token présent :", process.env.TOKEN ? "Oui" : "Non");

client
    .login(process.env.TOKEN)
    .then(() => console.log("✅ Bot connecté à Discord."))
    .catch((err) => console.error("❌ Erreur de connexion Discord :", err));

// Bloquer le process pour éviter l'arrêt du container
process.stdin.resume();
