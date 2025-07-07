// -------------------------------------------------------------
// IMC-MetabaseBot - index.js (réponse directe)
// -------------------------------------------------------------
require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');

// Vérification du token
const { TOKEN } = process.env;
if (!TOKEN) {
  console.error('❌ Le token du bot est requis dans process.env.TOKEN');
  process.exit(1);
}

// Initialisation du client Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;

  try {
    // Commande /imc
    if (commandName === 'imc') {
      const poids = interaction.options.getNumber('poids');
      const tailleCm = interaction.options.getNumber('taille');
      if (!poids || !tailleCm) {
        return interaction.reply({ content: '❌ Merci d’indiquer un poids et une taille valides.', ephemeral: true });
      }

      const tailleM = tailleCm / 100;
      const imc = poids / (tailleM * tailleM);
      let interpretation;
      let conseil;

      if (imc < 18.5) {
        interpretation = '📉 Insuffisance pondérale';
        conseil = '🍽️ Augmente tes apports caloriques avec des repas équilibrés.';
      } else if (imc < 25) {
        interpretation = '✅ Corpulence normale';
        conseil = '💪 Continue ton rythme alimentaire et ton activité physique.';
      } else if (imc < 30) {
        interpretation = '⚠️ Surpoids';
        conseil = '🏃‍♂️ Augmente ton activité physique et surveille ton alimentation.';
      } else if (imc < 35) {
        interpretation = '⚠️ Obésité modérée';
        conseil = '🩺 Mets en place un suivi alimentaire et consulte si besoin.';
      } else {
        interpretation = '🛑 Obésité sévère';
        conseil = '⚠️ Consulte rapidement un professionnel de santé.';
      }

      const embed = new EmbedBuilder()
        .setColor(0x00bfa5)
        .setTitle('🩺 Résultat de ton IMC')
        .addFields(
          { name: '🩻 IMC', value: imc.toFixed(1), inline: true },
          { name: '🗂️ Interprétation', value: interpretation, inline: true },
          { name: '💡 Conseil', value: conseil },
          { name: '📌 Formule', value: 'Poids (kg) ÷ Taille² (m²)' }
        )
        .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

      return interaction.reply({ embeds: [embed] });
    }

    // Commande /metabase (Métabolisme de Base)
    if (commandName === 'metabase') {
      const poids = interaction.options.getNumber('poids');
      const taille = interaction.options.getNumber('taille'); // en cm
      const age = interaction.options.getNumber('age');
      const sexe = interaction.options.getString('sexe');
      const activite = interaction.options.getNumber('activite');

      if (!poids || !taille || !age || !sexe || !activite) {
        return interaction.reply({ content: '❌ Merci de fournir toutes les informations demandées.', ephemeral: true });
      }

      // Calcul du MB selon Harris-Benedict
      let mb;
      switch (sexe.toLowerCase()) {
        case 'homme':
          mb = 10 * poids + 6.25 * taille - 5 * age + 5;
          break;
        case 'femme':
          mb = 10 * poids + 6.25 * taille - 5 * age - 161;
          break;
        default:
          return interaction.reply({ content: '❌ Sexe invalide. (homme/femme)', ephemeral: true });
      }

      const tdee = mb * activite;
      const embed = new EmbedBuilder()
        .setColor(0x00bfa5)
        .setTitle('🔥 Résultat de ton Métabolisme de Base')
        .addFields(
          { name: '🩻 MB (au repos)', value: `${Math.round(mb)} kcal/jour`, inline: true },
          { name: '🔥 TDEE (activité incluse)', value: `${Math.round(tdee)} kcal/jour`, inline: true },
          { name: '📌 Formule utilisée', value: 'Harris-Benedict (homme/femme), multiplié par le facteur d’activité' }
        )
        .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

      return interaction.reply({ embeds: [embed] });
    }

    // Commande non gérée
    return interaction.reply({ content: `❌ Commande inconnue : ${commandName}`, ephemeral: true });
  } catch (err) {
    console.error('❌ Erreur interactionCreate :', err);
    return interaction.reply({ content: '❌ Une erreur interne est survenue.', ephemeral: true });
  }
});

client.login(TOKEN);
