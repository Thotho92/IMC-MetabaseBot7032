require('dotenv').config();
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  EmbedBuilder 
} = require('discord.js');

// --- 1. Préparation du client ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  // --- 2. Enregistrement automatique des commandes en guild ---
  const commands = [
    // /imc
    new SlashCommandBuilder()
      .setName('imc')
      .setDescription('Calcule ton Indice de Masse Corporelle (IMC)')
      .addNumberOption(opt => opt
        .setName('poids')
        .setDescription('Ton poids en kg')
        .setRequired(true))
      .addNumberOption(opt => opt
        .setName('taille')
        .setDescription('Ta taille en cm')
        .setRequired(true))
      .toJSON(),

    // /metabase
    new SlashCommandBuilder()
      .setName('metabase')
      .setDescription('Calcule ton Métabolisme de Base (MB) et ton TDEE')
      .addNumberOption(opt => opt
        .setName('poids')
        .setDescription('Ton poids en kg')
        .setRequired(true))
      .addNumberOption(opt => opt
        .setName('taille')
        .setDescription('Ta taille en cm')
        .setRequired(true))
      .addNumberOption(opt => opt
        .setName('age')
        .setDescription('Ton âge en années')
        .setRequired(true))
      .addStringOption(opt => opt
        .setName('sexe')
        .setDescription('Ton sexe')
        .setRequired(true)
        .addChoices(
          { name: 'Homme', value: 'homme' },
          { name: 'Femme',  value: 'femme' },
        ))
      .addStringOption(opt => opt
        .setName('activite')              // sans accent, pour matcher options.getString('activite')
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
      .addStringOption(opt => opt
        .setName('objectif')
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
    console.log('✅ Commandes slash enregistrées en guild.');
  } catch (err) {
    console.error('❌ Erreur enregistrement commandes :', err);
  }
});

// --- 3. Gestion des interactions ---
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'imc') {
    const poids = options.getNumber('poids');
    const taille = options.getNumber('taille') / 100;
    const imc = poids / (taille * taille);
    let interpr = '';
    if (imc < 18.5) interpr = 'Insuffisance pondérale';
    else if (imc < 25) interpr = 'Corpulence normale';
    else if (imc < 30) interpr = 'Surpoids';
    else interpr = "Obésité";

    const embed = new EmbedBuilder()
      .setColor(0x00bfff)
      .setTitle('𓂀 Résultat de ton IMC')
      .addFields(
        { name: '📊 IMC', value: imc.toFixed(1), inline: true },
        { name: '📋 Interprétation', value: interpr, inline: true },
        { name: '💡 Conseil', value: imc < 25 
            ? "Continue ton rythme alimentaire et ton activité physique." 
            : "Ajuste ton apport/calories et reste actif." 
        },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
  else if (commandName === 'metabase') {
    const poids = options.getNumber('poids');
    const taille = options.getNumber('taille');
    const age = options.getNumber('age');
    const sexe = options.getString('sexe');
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
        { name: '🏃‍♂️ TDEE',    value: `${tdee} kcal/j`, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
  else if (commandName === 'objectif') {
    const obj = options.getString('objectif');
    let titre, conseil;
    switch(obj) {
      case 'perte':
        titre   = '🔻 Objectif : Perte de poids';
        conseil = 'Déficit modéré (~300 kcal/j), reste actif et préserve ta masse musculaire.';
        break;
      case 'prise':
        titre   = '💪 Objectif : Prise de muscle';
        conseil = 'Surplus léger (~200–300 kcal/j), force 3-4x/sem et bonne récupération.';
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

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
