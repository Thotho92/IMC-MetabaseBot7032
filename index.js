const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// ===================== ⚙️ INITIALISATION =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} est en ligne et prêt.`);
});

// ===================== 🔢 CONFIG COMPTEUR =====================
const COMPTEUR_CHANNEL_ID = '1393546143127961610';
const COSMIC_ROLE_ID = '1393547025072783522';
const compteurPath = './compteur.json';

let currentNumber = 1;
let lastAuthorId = null;
let lastMilestone = 0;
let userScores = {};

function chargerCompteur() {
  if (fs.existsSync(compteurPath)) {
    const data = JSON.parse(fs.readFileSync(compteurPath, 'utf-8'));
    currentNumber = data.currentNumber || 1;
    lastAuthorId = data.lastAuthorId || null;
    lastMilestone = data.lastMilestone || 0;
    userScores = data.userScores || {};
    console.log(`🔁 Compteur rechargé : ${currentNumber}`);
  } else {
    sauvegarderCompteur();
  }
}

function sauvegarderCompteur() {
  const data = {
    currentNumber,
    lastAuthorId,
    lastMilestone,
    userScores
  };
  fs.writeFileSync(compteurPath, JSON.stringify(data, null, 2));
}

const failMessages = [
  "❌ Oups, pas le bon chiffre chef.",
  "🧠 On t’a vu... mais t’es pas synchro.",
  "🔁 Essaie encore, ce n’est pas ça.",
  "🤖 Mauvais numéro détecté. On reboot ?",
  "📛 Nope. Le bon chiffre, c’est pas celui-là.",
];

// ===================== 📥 MESSAGES COMPTEUR =====================
client.on('messageCreate', async message => {
  if (message.channel.id !== COMPTEUR_CHANNEL_ID) return;
  if (message.author.bot) return;

  chargerCompteur();

  const content = message.content.trim();
  const parsedNumber = parseInt(content);
  if (isNaN(parsedNumber)) return;

  if (message.author.id === lastAuthorId) {
    await message.reply("🚫 Tu ne peux pas compter deux fois de suite !");
    return;
  }

  if (parsedNumber !== currentNumber) {
    const fail = failMessages[Math.floor(Math.random() * failMessages.length)];
    await message.reply(`${fail} Le bon chiffre était **${currentNumber}**.`);
    return;
  }

  const emojis = ["🚀", "🌟", "💫", "🧭"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  await message.react(emoji);
  lastAuthorId = message.author.id;
  currentNumber++;
  userScores[message.author.id] = (userScores[message.author.id] || 0) + 1;

  sauvegarderCompteur();

  if (currentNumber % 100 === 0 && currentNumber !== lastMilestone) {
    lastMilestone = currentNumber;
    const topUserId = Object.keys(userScores).reduce((a, b) => userScores[a] > userScores[b] ? a : b);
    const topMember = await message.guild.members.fetch(topUserId);

    const embed = new EmbedBuilder()
      .setTitle(`🚀 Cap ${currentNumber} atteint !`)
      .setDescription(`Félicitations à <@${topUserId}> pour sa contribution cosmique ✨\nTu gagnes le rôle **@cosmic-traveler** !`)
      .setColor('#00b0f4');

    await message.channel.send({ embeds: [embed] });

    const role = message.guild.roles.cache.get(COSMIC_ROLE_ID);
    if (role) {
      const allWithRole = message.guild.members.cache.filter(m => m.roles.cache.has(COSMIC_ROLE_ID));
      for (const member of allWithRole.values()) {
        await member.roles.remove(role).catch(() => {});
      }
      await topMember.roles.add(role).catch(() => {});
    }

    sauvegarderCompteur();
  }
});

// ===================== 📊 SLASH COMMANDS =====================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'imc') {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');

    if (!poids || !taille) {
      await interaction.reply({
        content: '❌ Merci de fournir le **poids** et la **taille** pour calculer ton IMC.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply();

    const tailleEnMetres = taille / 100;
    const imc = poids / (tailleEnMetres * tailleEnMetres);
    let interpretation =
      imc < 18.5 ? 'Insuffisance pondérale' :
      imc < 25 ? 'Corpulence normale' :
      imc < 30 ? 'Surpoids' :
      'Obésité';

    let conseil =
      imc < 18.5 ? "⚠️ Enrichis ton alimentation et consulte un pro si besoin." :
      imc < 25 ? "✅ IMC normal, continue sur ta lancée 💪." :
      imc < 30 ? "💡 Augmente ton activité et ajuste ton alimentation pour revenir dans la zone normale." :
      "🔥 Consulte un professionnel pour reprendre le contrôle de ta santé.";

    const embed = new EmbedBuilder()
      .setColor('#36D6B5')
      .setTitle('📊 Résultat de ton IMC')
      .addFields(
        { name: '📊 IMC', value: `${imc.toFixed(1)} (${interpretation})`, inline: false },
        { name: '💡 Conseil', value: conseil, inline: false },
        { name: '📌 Formule', value: 'Poids (kg) ÷ Taille² (m²)', inline: false }
      )
      .setFooter({ text: 'HealthyBot • Calcul IMC' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }

  if (interaction.commandName === 'metabase') {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');
    const age = interaction.options.getInteger('age');
    const sexe = interaction.options.getString('sexe');
    const activite = interaction.options.getString('activite');

    if (!poids || !taille || !age || !sexe || !activite) {
      await interaction.reply({
        content: '❌ Merci de fournir **poids, taille, âge, sexe et niveau d\'activité** pour calculer ton TDEE.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply();

    const mb = sexe === 'homme'
      ? 10 * poids + 6.25 * taille - 5 * age + 5
      : 10 * poids + 6.25 * taille - 5 * age - 161;

    const facteurs = {
      'faible': { facteur: 1.2, label: 'Faible' },
      'moderee': { facteur: 1.375, label: 'Modérée' },
      'elevee': { facteur: 1.55, label: 'Élevée' },
      'tres_elevee': { facteur: 1.725, label: 'Très Élevée' }
    };

    const tdee = Math.round(mb * facteurs[activite].facteur);

    const conseil =
      facteurs[activite].facteur < 1.4 ? "💡 Augmente doucement ton activité pour améliorer ton métabolisme." :
      facteurs[activite].facteur < 1.6 ? "✅ Ton niveau d'activité est bon, continue ainsi 💪." :
      "🔥 Excellent niveau d'activité, veille à un bon équilibre nutritionnel pour soutenir ton énergie.";

    const embed = new EmbedBuilder()
      .setColor('#FF5733')
      .setTitle('🔥 Résultat de ton TDEE')
      .addFields(
        { name: '⚖️ MB (Métabolisme de Base)', value: `${Math.round(mb)} kcal/jour`, inline: false },
        { name: '🏋️‍♂️ Activité', value: facteurs[activite].label, inline: false },
        { name: '🔥 TDEE', value: `${tdee} kcal/jour`, inline: false },
        { name: '💡 Conseil', value: conseil, inline: false },
        { name: '📌 Formule', value: 'MB x Facteur Activité', inline: false }
      )
      .setFooter({ text: 'HealthyBot • Calcul TDEE' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
});

// ===================== 🔁 ENREGISTREMENT DES COMMANDES =====================
const commands = [
  new SlashCommandBuilder()
    .setName('imc')
    .setDescription('Calcule ton IMC.')
    .addNumberOption(option => option.setName('poids').setDescription('Poids en kg').setRequired(true))
    .addNumberOption(option => option.setName('taille').setDescription('Taille en cm').setRequired(true)),
  new SlashCommandBuilder()
    .setName('metabase')
    .setDescription('Calcule ton MB et ton TDEE.')
    .addNumberOption(option => option.setName('poids').setDescription('Poids en kg').setRequired(true))
    .addNumberOption(option => option.setName('taille').setDescription('Taille en cm').setRequired(true))
    .addIntegerOption(option => option.setName('age').setDescription('Âge').setRequired(true))
    .addStringOption(option => option.setName('sexe').setDescription('Sexe').addChoices(
      { name: 'Homme', value: 'homme' },
      { name: 'Femme', value: 'femme' }
    ).setRequired(true))
    .addStringOption(option => option.setName('activite').setDescription('Niveau d\'activité').addChoices(
      { name: 'Faible', value: 'faible' },
      { name: 'Modérée', value: 'moderee' },
      { name: 'Élevée', value: 'elevee' },
      { name: 'Très Élevée', value: 'tres_elevee' }
    ).setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🛠️ Déploiement des commandes...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Commandes enregistrées avec succès.');
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.TOKEN);