const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('announce')
          .setDescription('create announcement for server')
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          .addStringOption(option => option.setName('announcement_content').setDescription('content for announcement').setRequired(true))
          .addStringOption(option => option.setName('embed_image').setDescription('URL for image').setRequired(true))
          .addIntegerOption(option => option.setName('hours').setDescription('hours for the announcement to run for').setRequired(true)),

          async execute(interaction, client){
          
            var ms = ((interaction.options.getInteger('hours') * 60) * 60) * 1000;
            var date_to_stop = Date.now() + ms; 


            if(Date.now() < date_to_stop){
                console.log('This is going to spam my bot')
            }

          }
}