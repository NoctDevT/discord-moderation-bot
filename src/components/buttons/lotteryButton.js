const {EmbedBuilder} = require("discord.js");
const {register, awardMoney, getBalance, checkIfDiscordIDExists, takeMoney} = require("../../database/dbService")
const getRandomNumber = require("../../helperFunctions/getRandomNumber")
const json = require('../../config/LotteryUsers.json')
const fs = require("fs");
const path = require("path");

const lotteryUsersFilePath = path.join(__dirname,"../../config/LotteryUsers.json");
const lotteryUsers = require("../../config/LotteryUsers.json");



module.exports = {
  data: {
    name: `LotteryBtn`,
  },
  async execute(interaction, client) {
    let doesExist = await checkIfDiscordIDExists(interaction.user.id);

    var amt = 20;

    if (client.lotteryActive === false) {
      return interaction.reply({
        content: `There is not an active lottery ongoing`,
        ephemeral: true,
      });
    }

    if (!doesExist) {
      var errMsg = `You are not registered, please use /register`;
      return interaction.reply({
        content: errMsg,
        ephemeral: true,
      });
    }

    let balance = await getBalance(interaction.user.id);


    if (amt > balance[0]) {
        return interaction.reply({
          content: `You do not have enough stamps💮 to gamble`,
        });
      }

    var takemoneyRes = await takeMoney(interaction.user.id, amt);

    if (takemoneyRes == false) {
      return interaction.reply({
        content: `Error, please contact Jyunnie`,
        ephemeral: true,
      });
    }



    
    lotteryUsers.push(interaction.user.id);

    const updatedData = JSON.stringify(lotteryUsers, null, 2);
    
    fs.writeFile(lotteryUsersFilePath, updatedData, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    
      console.log("Lottery user added to file");
    });




    client.lotteryJackpot += amt; 
    
    return interaction.reply({content: `${interaction.user} has joined the lottery!`})
  },
};


