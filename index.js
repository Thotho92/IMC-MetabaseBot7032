require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  REST,
  Routes
} = require('discord.js');

// ——————————————————————————
// 1) Initialisation du client
// ——————————————————————————
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Gérer les erreurs non capturées côté Discord.js
client.on('error', err => {
  console.error('🔴 Erreur client non gérée :', err);
});

// ——————————————————————————
// 2) Enregistrement automatique des slash-commands
//    (en guild, à chaque démarrage)
// ——————————————————————————
client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const commands = [
    // /imc
    new SlashCommandBuilder()
      .setName('imc')
      .setDescription('Calcule ton Indice de Masse Corporelle (IMC)')
      .addNumberOption(opt =>
        opt.setName('poids')
           .setDescription('Ton poids en kg')
           .setRequired(true))
      .addNumberOption(opt =>
        opt.setName('taille')
           .setDescription('Ta taille en cm')
           .setRequired(true))
      .toJSON(),

    // /metabase
    new SlashCommandBuilder()
      .setName('metabase')
      .setDescription('Calcule ton Métabolisme de Base (MB) et ton TDEE')
      .addNumberOption(opt =>
        opt.setName('poids')
           .setDescription('Ton poids en kg')
           .setRequired(true))
      .addNumberOption(opt =>
        opt.setName('taille')
           .setDescription('Ta taille en cm')
           .setRequired(true))
      .addNumberOption(opt =>
        opt.setName('age')
           .setDescription('Ton âge en années')
           .setRequired(true))
      .addStringOption(opt =>
        opt.setName('sexe')
           .setDescription('Ton sexe')
           .setRequired(true)
           .addChoices(
             { name: 'Homme', value: 'homme' },
             { name: 'Femme',  value: 'femme' },
           ))
      // Note : on enlève l'accent pour matcher options.getString('activite')
      .addStringOption(opt =>
        opt.setName('activite')
           .setDescription("Ton niveau d'activité")
           .setRequired(true)
           .addChoices(
             { name: 'Sédentaire', value: 'sedentaire' },
             { name: 'Peu actif',   value: 'peu_actif' },
             { name: 'Actif',       value: 'actif' },
             { name: 'Très actif',  value: 'tres_actif' },
           ))
      .toJSON(),

    // /objectif
    new SlashCommandBuilder()
      .setName('objectif')
      .setDescription('Définis ton objectif (perte, prise, maintien)')
      .addStringOption(opt =>
        opt.setName('objectif')
           .setDescription('Choisis : perte, prise ou maintien')
           .setRequired(true)
           .addChoices(
             { name: 'Perte de poids', value: 'perte' },
             { name: 'Prise de muscle', value: 'prise' },
             { name: 'Maintien',         value: 'maintien' },
           ))
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('✅ Commandes slash enregistrées en guild');
  } catch (err) {
    console.error('❌ Erreur enregistrement commandes :', err);
  }
});

// ——————————————————————————
// 3) Gestion des interactions
//    avec protection try/catch + deferReply
// ——————————————————————————
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const { commandName, options } = interaction;

    // On déférre rapidement l'interaction pour éviter le timeout 3 s
    await interaction.deferReply();

    if (commandName === 'imc') {
      const poids  = options.getNumber('poids');
      const taille = options.getNumber('taille') / 100;
      const imc    = poids / (taille * taille);

      let interpretation;
      if (imc < 18.5) interpretation = 'Insuffisance pondérale';
      else if (imc < 25) interpretation = 'Corpulence normale';
      else if (imc < 30) interpretation = 'Surpoids';
      else interpretation = 'Obésité';

      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle('𓂀 Résultat de ton IMC')
        .addFields(
          { name: '📊 IMC',            value: imc.toFixed(1),   inline: true },
          { name: '📋 Interprétation', value: interpretation,   inline: true },
          { name: '💡 Conseil',        value: interpretation === 'Corpulence normale'
              ? 'Continue ton rythme alimentaire et ton activité physique.'
              : 'Ajuste ton apport/calories et reste actif.' }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (commandName === 'metabase') {
      const poids    = options.getNumber('poids');
      const taille   = options.getNumber('taille');
      const age      = options.getNumber('age');
      const sexe     = options.getString('sexe');
      const activite = options.getString('activite');

      const mb = (sexe === 'homme')
        ? 10 * poids + 6.25 * taille - 5 * age + 5
        : 10 * poids + 6.25 * taille - 5 * age - 161;

      let fact = 1.2;
      if (activite === 'peu_actif') fact = 1.375;
      else if (activite === 'actif') fact = 1.55;
      else if (activite === 'tres_actif') fact = 1.725;

      const tdee = Math.round(mb * fact);

      const embed = new EmbedBuilder()
        .setColor(0xff8c00)
        .setTitle('🔥 Métabolisme & TDEE')
        .addFields(
          { name: '🩺 MB (repos)', value: `${Math.round(mb)} kcal/j`, inline: true },
          { name: '🏃‍♂️ TDEE',     value: `${tdee} kcal/j`,      inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (commandName === 'objectif') {
      const obj = options.getString('objectif');

      let titre, conseil;
      switch (obj) {
        case 'perte':
          titre   = '🔻 Objectif : Perte de poids';
          conseil = 'Déficit modéré (~300 kcal/j), reste actif et préserve ta masse musculaire.';
          break;
        case 'prise':
          titre   = '💪 Objectif : Prise de muscle';
          conseil = 'Surplus léger (~200–300 kcal/j), force 3–4×/sem et bonne récupération.';
          break;
        default:
          titre   = '⚖️ Objectif : Maintien';
          conseil = 'Maintiens ton TDEE, bouge chaque jour et ajuste selon ta balance.';
      }

      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle(titre)
        .setDescription(conseil)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Au cas où un autre commandName passe ici
    await interaction.editReply('⚠️ Commande inconnue');

  } catch (err) {
    console.error('💥 Erreur dans interactionCreate :', err);

    // Tenter de répondre ou éditer un message d’erreur
    if (interaction.deferred) {
      await interaction.editReply('😵 Oups, une erreur est survenue.');
    } else {
      await interaction.reply({
        content: '😵 Oups, une erreur est survenue.',
        ephemeral: true
      });
    }
  }
});

// ——————————————————————————
// 4) Démarrage du bot
// ——————————————————————————
client.login(process.env.TOKEN);
