const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('shutdown')
          .setDescription('Shut down the bot!'),
           
          async execute(interaction, client){
            
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                await interaction.reply({contents: 'Only administrators can use this command.'});
                return;
              }

              await interaction.reply({contents: `Bot has been shut down`})

               await client.destroy();



          }
}

