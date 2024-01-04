const { EmbedBuilder } = require("discord.js");
const { register, awardMoney, checkIfDiscordIDExists, getConfessionById  } = require("../../database/dbService");
const getRandomNumber = require("../../helperFunctions/getRandomNumber");

module.exports = {
  data: {
    name: "RejectConfession",
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
      var res = await getConfessionById(id)

      console.log(`Discord ID: ${res.discordID}`);

      const userMessages = await client.users.cache.get(res.discordID.toString()).createDM();
      await interaction.reply({ content: `Rejected, user has been notified.`, ephemeral: true });

      await message.delete();

      await userMessages.send(`Your confession was rejected by The Admin Team, this is either due to it not following our rules or being too graphic/explicit.`)

    } catch (error) {
      console.error(`Error fetching message: ${error}`);
      await interaction.reply({ content: "Error, please contact Jyunnie with error message" + error, ephemeral: true });
    }
  },
};