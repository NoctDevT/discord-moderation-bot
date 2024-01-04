const { EmbedBuilder } = require("discord.js");
const { register, awardMoney, checkIfDiscordIDExists } = require("../../database/dbService");
const getRandomNumber = require("../../helperFunctions/getRandomNumber");
const {confessionChannelID} = require('../../config/STATEVALUES');

module.exports = {
  data: {
    name: "approveConfession",
  },
  async execute(interaction, client) {
    const messageId = interaction.message.id;
    const channel = interaction.channel;

    console.log(`Message ID: ${messageId}`);
    console.log(`Channel: ${channel.name}`);

    try {
      const message = await channel.messages.fetch(messageId);
      const embed = message.embeds[0];

      const discordPattern = /<@(\d+)>/;
      const discordMatch = embed.description.match(discordPattern);
      const discordId = discordMatch[1];

      const idPattern = /from:<@(\d+)>/;
      const description = embed.description.replace(idPattern, "").replace("confessions:", "");

      const confessionEmbed = new EmbedBuilder()
      .setTitle("Confession")
      .setDescription(`${description}`)
      .setColor(client.color)
      .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
      .setTimestamp(Date.now())

     var confessionChannel = await client.channels.fetch(confessionChannelID);

     confessionChannel.send({embeds: [confessionEmbed]})
     await interaction.reply({ content: `Accepted, confession will be posted.`, ephemeral: true });

     await message.delete();

     const userMessages = await client.users.cache.get(discordId).createDM();
     await userMessages.send(`Your confession was accepted and is now in the <#1103257096310493254>`)

    } catch (error) {
      console.error(`Error fetching message: ${error}`);
      await interaction.reply({ content: "Error, please contact Jyunnie with error message" + error, ephemeral: true });
    }
  },
};