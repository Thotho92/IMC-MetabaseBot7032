require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        await interaction.deferReply();

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
                interpretation = '🚩 Insuffisance pondérale';
                conseil = '🍽️ Augmente tes apports caloriques avec des repas complets.';
            } else if (imc < 25) {
                interpretation = '✅ Corpulence normale';
                conseil = '💪 Continue ton hygiène de vie et ton activité physique.';
            } else if (imc < 30) {
                interpretation = '⚠️ Surpoids';
                conseil = '🏃‍♂️ Augmente ton activité physique et surveille ton alimentation.';
            } else if (imc < 35) {
                interpretation = '⚠️ Obésité modérée';
                conseil = '🍏 Mets en place un suivi alimentaire et consulte si besoin un professionnel.';
            } else {
                interpretation = '🚨 Obésité sévère';
                conseil = '📞 Consulte rapidement un professionnel de santé pour un accompagnement.';
            }

            const embed = new EmbedBuilder()
                .setColor(0x00bfa5)
                .setTitle('🩺 Résultat de ton IMC')
                .addFields(
                    { name: '📊 IMC', value: imc.toFixed(1), inline: true },
                    { name: '🩻 Interprétation', value: interpretation, inline: true },
                    { name: '💡 Conseil', value: conseil },
                    { name: '📌 Formule', value: 'Poids (kg) ÷ Taille (m)²' }
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
                return await interaction.editReply('❌ Erreur : sexe invalide.');
            }

            const tdee = mb * activite;

            const metaEmbed = new EmbedBuilder()
                .setColor(0x00ff87)
                .setTitle('🔥 Résultat de ton Métabolisme de Base')
                .addFields(
                    { name: '🛌 MB (au repos)', value: `${Math.round(mb)} kcal/jour`, inline: true },
                    { name: '🏃‍♂️ TDEE (activité incluse)', value: `${Math.round(tdee)} kcal/jour`, inline: true },
                    { name: '📌 Formule utilisée', value: 'Harris-Benedict : 10 × poids + 6.25 × taille - 5 × âge + 5 (homme) ou -161 (femme), multiplié par le facteur d\'activité' }
                )
                .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

            await interaction.editReply({ embeds: [metaEmbed] });
        }
    } catch (error) {
        console.error('❌ Erreur lors du traitement de l\'interaction :', error);
    }
});


process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(process.env.TOKEN);


