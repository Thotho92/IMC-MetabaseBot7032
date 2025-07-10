// 📂 utils/calculIMC.js

const { EmbedBuilder } = require('discord.js');

function calculerIMC(interaction) {
    const poids = interaction.options.getNumber('poids');
    const taille = interaction.options.getNumber('taille');

    if (!poids || !taille) {
        throw new Error('Poids ou taille manquant pour le calcul de l\'IMC.');
    }

    const tailleEnMetres = taille / 100;
    const imc = poids / (tailleEnMetres * tailleEnMetres);
    let interpretation = '';

    if (imc < 18.5) interpretation = 'Insuffisance pondérale';
    else if (imc < 25) interpretation = 'Corpulence normale';
    else if (imc < 30) interpretation = 'Surpoids';
    else if (imc < 35) interpretation = 'Obésité modérée';
    else if (imc < 40) interpretation = 'Obésité sévère';
    else interpretation = 'Obésité morbide';

    const imcEmbed = new EmbedBuilder()
        .setColor('#36D6B5')
        .setTitle('⚖️ Résultat IMC')
        .addFields(
            { name: 'IMC', value: `${imc.toFixed(2)}`, inline: true },
            { name: 'Interprétation', value: interpretation, inline: true }
        )
        .setFooter({ text: 'Healthy&Co • Calcul direct dans Discord' })
        .setTimestamp();

    return { embed: imcEmbed };
}

module.exports = { calculerIMC };
