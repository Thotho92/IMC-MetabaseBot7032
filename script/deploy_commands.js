const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
    new SlashCommandBuilder()
        .setName("imc")
        .setDescription("Calcule ton Indice de Masse Corporelle (IMC)")
        .addNumberOption(option =>
            option.setName("poids")
                .setDescription("Ton poids en kg")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("taille")
                .setDescription("Ta taille en cm")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("metabase")
        .setDescription("Calcule ton Métabolisme de Base (MB) et ton TDEE")
        .addNumberOption(option =>
            option.setName("poids")
                .setDescription("Ton poids en kg")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("taille")
                .setDescription("Ta taille en cm")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("age")
                .setDescription("Ton âge en années")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("sexe")
                .setDescription("Ton sexe")
                .setRequired(true)
                .addChoices(
                    { name: "Homme", value: "homme" },
                    { name: "Femme", value: "femme" },
                )
        )
        .addStringOption(option =>
            option.setName("activité")
                .setDescription("Ton niveau d'activité")
                .setRequired(true)
                .addChoices(
                    { name: "Sédentaire", value: "sedentaire" },
                    { name: "Peu actif", value: "peu_actif" },
                    { name: "Actif", value: "actif" },
                    { name: "Très actif", value: "tres_actif" },
                )
        ),

    new SlashCommandBuilder()
        .setName("objectif")
        .setDescription("Définis ton objectif (perte de poids, prise de muscle, maintien) et reçois tes kcal et macros")
        .addStringOption(option =>
            option.setName("objectif")
                .setDescription("Choisis ton objectif")
                .setRequired(true)
                .addChoices(
                    { name: "Perte de poids", value: "perte" },
                    { name: "Prise de muscle", value: "prise" },
                    { name: "Maintien", value: "maintien" },
                )
        ),
]
    .map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("✅ Déploiement des commandes slash en cours...");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log("✅ Commandes slash déployées sur la guilde avec succès.");
    } catch (error) {
        console.error(error);
    }
})();
