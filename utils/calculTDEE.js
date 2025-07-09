const { EmbedBuilder } = require('discord.js');

function calculerTDEE(interaction) {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');
    const age = interaction.options.getInteger('age');
    const sexe = interaction.options.getString('sexe');
    const activite = interaction.options.getString('activite');

    if (!poids || !taille || !age || !sexe || !activite) {
        throw new Error('Données manquantes pour le calcul TDEE');
    }

    let mb = sexe === 'homme'
        ? 10 * poids + 6.25 * taille - 5 * age + 5
        : 10 * poids + 6.25 * taille - 5 * age - 161;

    const facteurs = {
        faible: 1.2,
        moderee: 1.375,
        elevee: 1.55,
        tres_elevee: 1.725,
    };

    const facteur = facteurs[activite];
    const tdee = Math.round(mb * facteur);

    const embed = new EmbedBuilder()
        .setColor('#00FF99')
        .setTitle('🔥 Résultat TDEE')
        .addFields(
            { name: '⚡ MB', value: `${Math.round(mb)} kcal`, inline: true },
            { name: '🏃 Activité', value: activite, inline: true },
            { name: '🍽️ TDEE', value: `${tdee} kcal/jour`, inline: false }
        )
        .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

    return { embed };
}

module.exports = { calculerTDEE };