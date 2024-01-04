
const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');

const imageUrls = [
        'https://media.tenor.com/a0QM0Hek4V4AAAAC/cute-kawaii.gif',
        'https://media.tenor.com/5EhsDOP2eecAAAAC/nichijou-cat-pose.gif',
        'https://media.tenor.com/Kj6s3vYeWJEAAAAS/neko-cute.gif',
        'https://media.tenor.com/zh6W7yC8AvoAAAAd/neko-dance.gif',
        'https://media.tenor.com/uZOo37sDeM0AAAAd/anime-cat-girl-kiss.gif',
        'https://media.tenor.com/6sXqdnZcf0sAAAAd/cute-girl-cat-girl.gif'
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