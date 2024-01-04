const {EmbedBuilder} = require("discord.js");
const {register, awardMoney, checkIfDiscordIDExists} = require("../../database/dbService")
const getRandomNumber = require("../../helperFunctions/getRandomNumber")

module.exports = {
  data: {
    name: `dummyPickBtn`,
  },
  async execute(interaction, client) {
    let doesExist = await checkIfDiscordIDExists(interaction.user.id);

    if (!doesExist) {
       var errMsg = `You are not registered, please use /register`;
      return interaction.reply({
        content: errMsg,
        ephemeral: true,
      });
    }

    // interaction.reply({content: `You've clicked a dummy button! Try again`,  ephemeral: true})
    // return setTimeout(() => interaction.deleteReply(), 2000);

    return interaction.reply({content: `You've clicked a dummy button! Try again`,  ephemeral: true}).then(reply => {
      setTimeout(() => {
        reply.delete()
        .catch(console.error);
      }, 3500)
    }).catch(console.error)

  
  },
};