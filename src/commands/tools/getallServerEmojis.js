const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('grabemojis')
          .setDescription('returns a list of emojis within the terminal'),
          async execute(interaction, client){
            const emojis = interaction.guild.emojis.cache;
            emojis.each(emoji => console.log(`${emoji.id} : ${emoji.name}`));
            await interaction.reply('Emojis have been printed to console!');


   
          }
}

