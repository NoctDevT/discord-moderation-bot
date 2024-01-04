const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');

const imageUrls = [
    'https://media.tenor.com/GPqyP_Ov0zoAAAAC/gojo-jujutsu-kaisen.gif',
    'https://media.tenor.com/kOYccDoEgSEAAAAC/rizz-gojo-gojo.gif',
    'https://64.media.tumblr.com/8faa871d385f189d38f2a33620bd93ed/28be1896a99f9178-13/s540x810/3f27439a12a15bdaf099e4d73f77760cfc20dbb7.gif',
    'https://giffiles.alphacoders.com/211/211804.gif',
    'https://media.tenor.com/Lz7upP_Q_qkAAAAC/gojo-gojo-satoru.gif',
    'https://media.tenor.com/1ZN7wIi-68MAAAAd/gojo-jjk.gif'
  ];

function getRandomImage() {
    // Get a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
  
    // Return the image URL at the random index
    return imageUrls[randomIndex];
  }
  
  // Example usage:

  
  const randomImage = getRandomImage(imageUrls);
  console.log('Random image URL:', randomImage);

  module.exports = getRandomImage