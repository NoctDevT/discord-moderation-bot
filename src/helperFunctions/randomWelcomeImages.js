
const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');

const imageUrls = [
            'https://media.tenor.com/bcqLdYBLOhUAAAAC/suzume-no-tojimari.gif',
            'https://media.tenor.com/OcnKh6l_jIIAAAAC/green-tea-anime.gif',
            'https://i.pinimg.com/originals/e6/50/08/e65008deeb45946029781fb8c6a15df4.gif',
            'https://media.tenor.com/JaO6sQhdFTwAAAAC/anime-anime-food.gif',
            'https://media.tenor.com/YdhgfW4z8LsAAAAC/so-cute-love-boba.gif',
            'https://i.makeagif.com/media/10-10-2020/YoN5Aj.gif'
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