const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBalance, sendMoney, awardMoney, checkIfDiscordIDExists } = require("../../database/dbService");
const getRandomNumber = require('../../helperFunctions/getRandomNumber');
const fs = require("fs");
const path = require("path");

const cooldownsFile = require("../../config/dailycooldowns.json");
const cooldownsFilePath = path.join(__dirname, "../../config/dailycooldowns.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("daily currency award")
    .addBooleanOption(option => option.setName('alert').setDescription('Whether to be alerted when your dailys are available')),

  async execute(interaction, client) {
    const userId = interaction.user.id;

    var AlertStatus = interaction.options.getBoolean('alert')

   // Add user to cooldownsFile object if they do not exist
   if (!cooldownsFile[userId]) {
    cooldownsFile[userId] = {
      lastClaimed: null,
      alertSet: false,
    };
  }

 let doesExist = await checkIfDiscordIDExists(userId)

 if(!doesExist) {
      var errMsg = interaction.options.getUser("target")
      ? `${user} is not registered, please use /register`
      : `You are not registered, please use /register`;
    return interaction.reply({
      content: errMsg,
      ephemeral: true,
});
 } 



    const currentDate = new Date();
    const lastClaimed = new Date(cooldownsFile[userId]?.lastClaimed)?.toISOString();
    const timeSinceLastClaimed = currentDate.getTime() - new Date(lastClaimed).getTime();
    const timeRemaining = (24 * 60 * 60 * 1000) - timeSinceLastClaimed;
    // const timeRemaining = (1 * 60 * 1000) - timeSinceLastClaimed;
    const timeRemainingHours = Math.max(Math.floor(timeRemaining / (60 * 60 * 1000)), 0);
    const timeRemainingMinutes = Math.max(Math.floor((timeRemaining - (timeRemainingHours * 60 * 60 * 1000)) / (60 * 1000)), 0);



    console.log({timeSinceLastClaimed: timeSinceLastClaimed})

    console.log({'24hours': (24 * 60 * 60 * 1000)})

    if (timeSinceLastClaimed < (24 * 60 * 60 * 1000)) {
      return interaction.reply(`You have already claimed your daily reward today! You can claim it again in ${timeRemainingHours} hours and ${timeRemainingMinutes} minutes.`);
    }

    // Award daily reward
    const amt = getRandomNumber(2, 8);
    await awardMoney( userId, amt);

    if(AlertStatus === true){
      console.log('ik this fires')

        dailyAlert(interaction, client)
    }

    if(cooldownsFile[userId]?.alertSet === true){
        dailyAlert(interaction, client)
    }

    // Update the cooldownsFile object and save it to the JSON file


    if (AlertStatus) {
        cooldownsFile[userId] = {
          lastClaimed: currentDate.toISOString(),
          alertSet: AlertStatus
        };
        fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
      } else {
        if (cooldownsFile[userId].alertSet === true) {
          cooldownsFile[userId] = {
            lastClaimed: currentDate.toISOString(),
            alertSet: true
          };
          fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
        } else {
          cooldownsFile[userId] = {
            lastClaimed: currentDate.toISOString(),
            alertSet: false
          };
          fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
        }
      }

   
  



   

    // Send confirmation message
    const embed3 = new EmbedBuilder()
      .setTitle(`Economy`)
      .setDescription(`You have claimed your daily and have been awarded ${amt} 💮`)
      .setColor(client.color)
      .setThumbnail("https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg")
      .setTimestamp(Date.now());

   return interaction.reply({ embeds: [embed3] });
  },
};

async function dailyAlert(interaction, client) {
  const userId = interaction.user.id;
  const cooldownDuration = (24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const now = new Date();
  const lastClaimedDate = new Date(cooldownsFile[userId].lastClaimed);
  let timeRemainingMs = cooldownDuration - (now - lastClaimedDate);

  console.log(timeRemainingMs);

  // Ensure timeRemainingMs is positive
  if (timeRemainingMs <= 0) {
    timeRemainingMs = cooldownDuration;
  }

  setTimeout(async () => {
    const user = await client.users.fetch(userId);
    user.send("It's time to claim your daily reward! Use the /daily command to claim it.");
    cooldownsFile[userId].alertSet = false;
    fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
  }, timeRemainingMs);

  cooldownsFile[userId].alertSet = true;
  fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
}