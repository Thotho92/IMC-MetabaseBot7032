// ✅ index.js complet prêt Replit / Railway
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, InteractionType } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    if (interaction.commandName === 'imc') {
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille');

        const imc = poids / (taille * taille);
        let interpretation = '';

        if (imc < 18.5) interpretation = '🚩 Insuffisance pondérale';
        else if (imc < 25) interpretation = '✅ Poids normal';
        else if (imc < 30) interpretation = '⚠️ Surpoids';
        else interpretation = '🚩 Obésité';

        const embed = new EmbedBuilder()
            .setColor('#00bfa5')
            .setTitle('📊 Résultat de ton IMC')
            .addFields(
                { name: '📈 Ton IMC', value: imc.toFixed(2), inline: true },
                { name: '📑 Interprétation', value: interpretation, inline: true },
                { name: '📏 Formule utilisée', value: 'Poids (kg) ÷ Taille² (m²)' }
            )
            .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

        await interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === 'metabase') {
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille') * 100; // en cm
        const age = interaction.options.getInteger('age');
        const sexe = interaction.options.getString('sexe');

        let mb;
        if (sexe === 'homme') {
            mb = (10 * poids) + (6.25 * taille) - (5 * age) + 5;
        } else {
            mb = (10 * poids) + (6.25 * taille) - (5 * age) - 161;
        }

        const embed = new EmbedBuilder()
            .setColor('#ff6f00')
            .setTitle('🔥 Résultat de ton Métabolisme de Base (MB)')
            .setDescription(`Voici ton métabolisme de base calculé selon Mifflin-St Jeor :`)
            .addFields(
                { name: '🔥 Ton MB', value: `${Math.round(mb)} kcal/jour`, inline: true },
                { name: '📋 Formule utilisée', value: 'Mifflin-St Jeor' }
            )
            .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
