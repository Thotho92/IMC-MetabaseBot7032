require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply();
        }

        if (interaction.commandName === 'imc') {
            const poids = interaction.options.getNumber('poids');
            const taille = interaction.options.getNumber('taille') / 100;
            if (!poids || !taille) {
                return await interaction.editReply('❌ Merci d\'indiquer un poids et une taille valides.');
            }
            const imc = poids / (taille * taille);
            let interpretation = '';
            let conseil = '';

            if (imc < 18.5) {
                interpretation = '📌 Insuffisance pondérale';
                conseil = '🍽️ Augmente ton apport calorique.';
            } else if (imc < 25) {
                interpretation = '✅ Corpulence normale';
                conseil = '💪 Continue ton rythme alimentaire et ton activité.';
            } else if (imc < 30) {
                interpretation = '⚠️ Surpoids';
                conseil = '🏃 Augmente ton activité et surveille ton alimentation.';
            } else {
                interpretation = '❌ Obésité';
                conseil = '📞 Consulte un professionnel de santé.';
            }

            const embed = new EmbedBuilder()
                .setColor(0x00bfa5)
                .setTitle('🩺 Résultat de ton IMC')
                .addFields(
                    { name: '📊 IMC', value: imc.toFixed(1), inline: true },
                    { name: '📌 Interprétation', value: interpretation, inline: true },
                    { name: '💡 Conseil', value: conseil },
                    { name: '📏 Formule', value: 'Poids (kg) ÷ Taille² (m²)' }
                )
                .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

            await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.commandName === 'metabase') {
            const poids = interaction.options.getNumber('poids');
            const taille = interaction.options.getNumber('taille');
            const age = interaction.options.getNumber('age');
            const sexe = interaction.options.getString('sexe');
            const activite = parseFloat(interaction.options.getString('activite'));

            if (!poids || !taille || !age || !sexe || isNaN(activite)) {
                return await interaction.editReply('❌ Merci de fournir toutes les informations demandées.');
            }

            let mb;
            if (sexe === 'homme') {
                mb = 10 * poids + 6.25 * taille - 5 * age + 5;
            } else if (sexe === 'femme') {
                mb = 10 * poids + 6.25 * taille - 5 * age - 161;
            } else {
                return await interaction.editReply('❌ Sexe invalide.');
            }

            const tdee = mb * activite;

            const embed = new EmbedBuilder()
                .setColor(0x00bfa5)
                .setTitle('🔥 Résultat de ton Métabolisme de Base')
                .addFields(
                    { name: '🛌 MB (au repos)', value: `${Math.round(mb)} kcal/jour`, inline: true },
                    { name: '🏃 TDEE (activité incluse)', value: `${Math.round(tdee)} kcal/jour`, inline: true },
                    { name: '📏 Formule utilisée', value: 'Mifflin-St Jeor: 10×poids + 6.25×taille - 5×âge + 5 (H) / -161 (F), multiplié par facteur activité' }
                )
                .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

            await interaction.editReply({ embeds: [embed] });
        }

    } catch (error) {
        console.error('❌ Erreur de traitement:', error);
    }
});

client.login(process.env.TOKEN);
