// 📂 utils/embedutils.js

const { EmbedBuilder } = require('discord.js');

function createSimpleEmbed({ title, description, color = '#00FF99', footer = 'HealthyBot' }) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: footer });
}

module.exports = { createSimpleEmbed };
