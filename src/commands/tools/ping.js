const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
          .setName('ping')
          .setDescription('Return my ping!'),
          async execute(interaction, client){
            const message = await interaction.deferReply({
              fetchReply: true
            }); 

            const newMessage =  `API Latency: ${client.ws.ping}\n Client ping: ${message.createdTimestamp - interaction.createdTimestamp } - CHANGE HAS BEEN MADE TO THE SERVER`
            await interaction.editReply({
                content: newMessage
            });

          }
}



