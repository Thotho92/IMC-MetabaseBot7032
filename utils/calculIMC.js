// 📂 utils/calculIMC.js

const { EmbedBuilder } = require('discord.js');

function calculerIMC(interaction) {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');

    if (!poids || !taille) {
        throw new Error('Poids ou taille manquant pour le calcul IMC.');
    }

    const tailleEnMetres = taille / 100;
    const imc = poids / (tailleEnMetres * tailleEnMetres);
    const imcArrondi = imc.toFixed(1);

    let interpretation = '';
    let conseil = '';

    if (imc < 18.5) {
        interpretation = 'Insuffisance pondérale';
        conseil = 'Augmente légèrement tes apports caloriques.';
    } else if (imc < 25) {
        interpretation = 'Corpulence normale';
        conseil = 'Continue ton rythme alimentaire et ton activité physique.';
    } else if (imc < 30) {
        interpretation = 'Surpoids';
        conseil = 'Envisage une activité physique régulière et une alimentation équilibrée.';
    } else {
        interpretation = 'Obésité';
        conseil = 'Consulte un professionnel de santé pour un accompagnement adapté.';
    }

    const imcEmbed = new EmbedBuilder()
        .setColor('#00FF99')
        .setTitle('📊 Résultat de ton IMC')
        .addFields(
            { name: '💪 IMC', value: `${imcArrondi}`, inline: true },
            { name: '📋 Interprétation', value: `${interpretation}`, inline: true },
            { name: '💡 Conseil', value: conseil },
            { name: '📏 Formule', value: 'Poids (kg) ÷ Taille² (m²)' }
        )
        .setFooter({ text: 'HealthyBot • Calcul direct dans Discord' });

    return { embed: imcEmbed };
}

module.exports = { calculerIMC };
