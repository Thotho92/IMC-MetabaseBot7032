const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder,
} = require("discord.js");
require("dotenv").config();

// Créer le client
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Connexion prête
client.once(Events.ClientReady, () => {
    console.log("✅ Bot connecté, prêt à écouter les commandes.");
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

// Gestion des interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Commande IMC
    if (interaction.commandName === "imc") {
        const imcEmbed = new EmbedBuilder()
            .setColor("#00bfa5")
            .setTitle("🧮 Calcul de ton IMC")
            .setDescription("L'IMC (Indice de Masse Corporelle) évalue si ton poids est adapté à ta taille.")
            .addFields(
                {
                    name: "📏 Formule",
                    value: "Poids (kg) ÷ Taille² (m²)"
                },
                {
                    name: "🔗 Lien",
                    value: "[Calculer mon IMC](https://www.calculersonimc.fr/)"
                }
            )
            .setFooter({
                text: "HealthyBot • Calcul IMC",
                iconURL: client.user.displayAvatarURL(),
            });

        await interaction.reply({ embeds: [imcEmbed] });
    }

    // Commande METABASE
    if (interaction.commandName === "metabase") {
        const metaEmbed = new EmbedBuilder()
            .setColor("#ff6f00")
            .setTitle("🔥 Calcul de ton Métabolisme de Base (MB)")
            .setDescription("Le MB correspond aux calories que ton corps brûle au repos pour maintenir ses fonctions vitales.")
            .addFields(
                {
                    name: "📏 Formule (Mifflin-St Jeor)",
                    value: "- Homme: (10 x poids) + (6,25 x taille) - (5 x âge) + 5\n- Femme: (10 x poids) + (6,25 x taille) - (5 x âge) - 161"
                },
                {
                    name: "🔗 Lien",
                    value: "[Calculer mon MB](https://www.calculersonimc.fr/metabolisme-de-base/)"
                }
            )
            .setFooter({
                text: "HealthyBot • Calcul MB",
                iconURL: client.user.displayAvatarURL(),
            });

        await interaction.reply({ embeds: [metaEmbed] });
    }
});

// Logs lancement
console.log("✅ IMC-MetabaseBot: Script lancé.");
console.log(`✅ Token présent : ${process.env.TOKEN ? "Oui" : "Non"}`);

// Connexion Discord
client.login(process.env.TOKEN)
    .then(() => console.log("✅ Bot connecté à Discord."))
    .catch(err => console.error("❌ Erreur de connexion Discord :", err));

// Maintenir Railway actif
process.stdin.resume();

