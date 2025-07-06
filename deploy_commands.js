// ✅ Nouveau deploy_commands.js prêt pour IMC et Metabase calcul direct dans Discord
// À lancer une fois pour push slash commands sur ton bot (Replit, Railway, GitHub)

const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
    new SlashCommandBuilder()
        .setName("imc")
        .setDescription(
            "Calcule ton Indice de Masse Corporelle (IMC) directement dans Discord",
        )
        .addNumberOption((option) =>
            option
                .setName("poids")
                .setDescription("Ton poids en kg")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("taille")
                .setDescription("Ta taille en cm")
                .setRequired(true),
        ),

    new SlashCommandBuilder()
        .setName("metabase")
        .setDescription(
            "Calcule ton Métabolisme de Base (MB) directement dans Discord",
        )
        .addNumberOption((option) =>
            option
                .setName("poids")
                .setDescription("Ton poids en kg")
                .setRequired(true),
        )
        .addNumberOption((option) =>
            option
                .setName("taille")
                .setDescription("Ta taille en cm")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option.setName("age").setDescription("Ton âge").setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("sexe")
                .setDescription("Ton sexe (homme ou femme)")
                .setRequired(true)
                .addChoices(
                    { name: "homme", value: "homme" },
                    { name: "femme", value: "femme" },
                ),
        ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🚀 Déploiement des commandes slash en cours...");

        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID,
                ),
                { body: commands },
            );
            console.log(
                "✅ Commandes slash déployées sur la guilde avec succès.",
            );
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: commands,
            });
            console.log("✅ Commandes slash globales déployées avec succès.");
        }
    } catch (error) {
        console.error(error);
    }
})();
