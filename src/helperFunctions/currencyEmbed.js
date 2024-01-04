const {EmbedBuilder  } = require('discord.js');
const getRandomImage = require('./gojoImgs')

function getRandomEmbed(color) {

    let image = getRandomImage()

    const embed = new EmbedBuilder()
      .setTitle('Economy module')
      .setDescription('Quick! I dropped some Boba Stamps💮! Click the correct button to collect them!')
      .setTimestamp()
      .setColor(color)
      .setImage(image);
  
    return embed;
  }

  module.exports = getRandomEmbed