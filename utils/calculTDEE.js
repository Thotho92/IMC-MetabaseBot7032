const { EmbedBuilder } = require('discord.js');

function calculerTDEE(interaction) {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');
    const age = interaction.options.getInteger('age');
    const sexe = interaction.options.getString('sexe');
    const activite = interaction.options.getString('activite');

    if (!poids || !taille || !age || !sexe || !activite) {
        throw new Error('Informations manquantes pour le calcul du TDEE.');
    }

    let mb;
    if (sexe === 'homme') {
        mb = 10 * poids + 6.25 * taille - 5 * age + 5;
    } else if (sexe === 'femme') {
        mb = 10 * poids + 6.25 * taille - 5 * age - 161;
    } else {
        throw new Error('Sexe invalide.');
    }

    const facteursActivite = {
        faible: 1.2,
        moderee: 1.375,
        elevee: 1.55,
        tres_elevee: 1.725
    };

    const facteur = facteursActivite[activite];
    if (!facteur) {
        throw new Error('Niveau d\'activité invalide.');
    }

    const tdee = Math.round(mb * facteur);

    const tdeeEmbed = new EmbedBuilder()
        .setColor('#00FF99')
        .setTitle('🔥 Résultat de ton TDEE')
        .addFields(
            { name: '⚡ Métabolisme de Base (MB)', value: `${Math.round(mb)} kcal/jour`, inline: true },
            { name: '🏃‍♂️ Activité', value: `${activite}`, inline: true },
            { name: '🍽️ Besoins caloriques (TDEE)', value: `${tdee} kcal/jour` }
        )
        .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

    return { embed: tdeeEmbed };
}

module.exports = { calculerTDEE };
