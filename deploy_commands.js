const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
    new SlashCommandBuilder()
        .setName("imc")
        .setDescription("Calcule ton Indice de Masse Corporelle (IMC)")
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
        .setDescription("Calcule ton Métabolisme de Base (MB) et ton TDEE")
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
            option
                .setName("age")
                .setDescription("Ton âge en années")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("sexe")
                .setDescription("Ton sexe (homme ou femme)")
                .setRequired(true)
                .addChoices(
                    { name: "Homme", value: "homme" },
                    { name: "Femme", value: "femme" },
                ),
        )
        .addStringOption((option) =>
            option
                .setName("activite")
                .setDescription("Ton niveau d'activité")
                .setRequired(true)
                .addChoices(
                    { name: "Sédentaire (x1.2)", value: "1.2" },
                    { name: "Légèrement actif (x1.375)", value: "1.375" },
                    { name: "Modérément actif (x1.55)", value: "1.55" },
                    { name: "Très actif (x1.725)", value: "1.725" },
                    { name: "Extrêmement actif (x1.9)", value: "1.9" },
                ),
        )
        .toJSON(),
];

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
