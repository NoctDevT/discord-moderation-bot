const { EmbedBuilder } = require("discord.js");
const {
  register,
  awardMoney,
  checkIfDiscordIDExists,
} = require("../../database/dbService");
const getRandomNumber = require("../../helperFunctions/getRandomNumber");

module.exports = {
  data: {
    name: `pickBtnCorrect`,
  },
  async execute(interaction, client) {
    // Initialize redeemedInteractions Set if it doesn't exist in the client object
    if (!client.redeemedInteractions) {
        client.redeemedInteractions = new Set();
    }

    let doesExist = await checkIfDiscordIDExists(interaction.user.id);
    const amt = getRandomNumber(8, 16);

    if (!doesExist) {
      var errMsg = `You are not registered, please use /register`;
      return interaction.reply({
        content: errMsg,
        ephemeral: true,
      });
    }

    const customId = interaction.customId;

    if (client.redeemedInteractions.has(customId)) {
      return interaction.reply({
        content: "Not fast enough, someone has redeemed it.",
        ephemeral: true,
      });
    }

    await awardMoney(interaction.user.id, amt);
    client.redeemedInteractions.add(customId);
    console.log({ redeemedInteractions: client.redeemedInteractions, id: interaction.user.id });
    // interaction.reply({
    //   content: `${interaction.user} has been awarded ${amt}stamps💮`,        ephemeral: false,
    //  } );
    //  return setTimeout(() => interaction.deleteReply(), 5000);

    return interaction.reply({
      content: `${interaction.user} has been awarded ${amt}stamps💮`,
      ephemeral: false, 
    }).then(reply => {
      setTimeout(() => {
        reply.delete()
        .catch(console.error);
      }, 20000)
    }).catch(console.error)

  },
};