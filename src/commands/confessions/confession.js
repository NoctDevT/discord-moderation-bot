const { SlashCommandBuilder, EmbedBuilder, Embed, Message, ActionRowBuilder, ButtonBuilder,   ButtonStyle } = require('discord.js');
require('../../database/dbService')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('archivedconfessions')
          .setDescription('Super Secret Command')
          .addStringOption((option) => option.setName('confession').setDescription('Confession to send').setRequired(true)),

          async execute(interaction, client){

            await interaction.reply({content: `This command has been archived, use /confessions`,  ephemeral: true})


          }
}


