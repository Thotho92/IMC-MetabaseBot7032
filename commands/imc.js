// 📂 commands/imc.js

const { SlashCommandBuilder } = require('discord.js');
const { calculerIMC } = require('../utils/calculIMC');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imc')
        .setDescription('Calcule ton Indice de Masse Corporelle (IMC) et interprétation.')
        .addNumberOption(option =>
            option.setName('poids').setDescription('Ton poids en kg').setRequired(true))
        .addNumberOption(option =>
            option.setName('taille').setDescription('Ta taille en cm').setRequired(true)),
    async execute(interaction) {
        try {
            console.log('✅ Commande /imc reçue.');

            await interaction.deferReply();

            const { embed } = calculerIMC(interaction);
            await interaction.editReply({ embeds: [embed] });

            console.log('✅ Résultat IMC envoyé.');
        } catch (error) {
            console.error('❌ Erreur dans la commande /imc :', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: '❌ Une erreur est survenue lors du calcul IMC.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Une erreur est survenue lors du calcul IMC.', ephemeral: true });
            }
        }
    },
};
