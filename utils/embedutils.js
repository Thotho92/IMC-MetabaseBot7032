// 📂 utils/embedutils.js

const { EmbedBuilder } = require('discord.js');

function createStandardEmbed({ title, description = null, fields = [], color = '#36D6B5', footerText = 'Healthy&Co • Calcul direct dans Discord', thumbnail = null }) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setFooter({ text: footerText });

    if (description) embed.setDescription(description);
    if (fields.length > 0) embed.addFields(fields);
    if (thumbnail) embed.setThumbnail(thumbnail);

    return embed;
}

module.exports = { createStandardEmbed };
