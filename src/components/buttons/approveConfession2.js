const { EmbedBuilder } = require("discord.js");
const {getConfessionById} = require("../../database/dbService");
const {confessionChannelID} = require('../../config/STATEVALUES');

module.exports = {
  data: {
    name: "approveConfession2",
  },
  async execute(interaction, client) {
    const messageId = interaction.message.id;
    const channel = interaction.channel;

    console.log(`Message ID: ${messageId}`);
    console.log(`Channel: ${channel.name}`);

    try {
      const message = await channel.messages.fetch(messageId);
      const embed = message.embeds[0];

      const id = embed.title.split(":#")[1]

      console.log({id})

     
      
     var res = await getConfessionById(id)

      const confessionEmbed = new EmbedBuilder()
      .setTitle(`Confession:#${res.ConfessionID}`)
      .setDescription(`${res.confession}`)
      .setColor(client.color)
      .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
      .setTimestamp(Date.now())
      .setFooter({ text: 'Confession Module', iconURL: 'https://i.pinimg.com/originals/c2/82/72/c28272c9dd45d1064fab4e8e4c677405.jpg' });


     var confessionChannel = await client.channels.fetch(confessionChannelID);

     confessionChannel.send({embeds: [confessionEmbed]})
     await interaction.reply({ content: `Accepted, confession will be posted.`, ephemeral: true });

     await message.delete();

     const userMessages = await client.users.cache.get(res.discordID).createDM();
     await userMessages.send(`Your confession was accepted and is now in the <#1103257096310493254>`)

    } catch (error) {
      console.error(`Error fetching message: ${error}`);
      await interaction.reply({ content: "Error, please contact Jyunnie with error message" + error, ephemeral: true });
    }
  },
};