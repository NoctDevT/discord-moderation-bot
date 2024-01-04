const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { deleteReactionRoleMessageID } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gojoremoverr")
    .setDescription("Removes a reaction role category")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("category")
        .setRequired(true)
        .addChoices(
          { name: "Gaming", value: "Gaming" },
          { name: "Arts", value: "Arts" },
          { name: "Age", value: "Age" },
          { name: "Gender", value: "Gender" },
          { name: "Country", value: "Country" },
          { name: "Interest", value: "Interests" },
          { name: "PartyGames", value: "PartyGames" },
          { name: "Pings", value: "Pings" },
          { name: "Color", value: "Color" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const category = interaction.options.getString("category");
    const channelId = interaction.channelId;

    await interaction.deferReply();
    
    var message =  `No messages found`
    var counter = 0; 

    try {
      var roleMsgs = await deleteReactionRoleMessageID(category);

      await Promise.all(
        roleMsgs.map(async (resObj) => {
          const channel = client.channels.cache.get(resObj.channelID);
          const fetchedMessage = await channel.messages.fetch(resObj.messageID);

          if (fetchedMessage) {
            await fetchedMessage.delete();
            counter++;
            message = `Deleted ${counter} messages`;
          }
        })
      );
      await interaction.editReply({content: message})

    } catch (e) {
      console.error(e);
      await interaction.editeply({
        content: `An error has occurred whilst running this command, please let the bot developer or staff know.`,
      });
    }
  },
};
