const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const cooldownsFile = require("../../config/dailycooldowns.json");
const cooldownsFilePath = path.join(__dirname, "../../config/dailycooldowns.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dailyalert")
    .setDescription("Alert me when it's time to redeem my daily reward"),

  async execute(interaction, client) {
    const userId = interaction.user.id;
    // const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const cooldownDuration = (1 * 60 * 1000);

    if (!cooldownsFile[userId] || !cooldownsFile[userId].lastClaimed) {
      return interaction.reply("You haven't claimed your daily reward yet! Use the /daily command to claim it.");
    }

    if (cooldownsFile[userId].alertSet) {
      return interaction.reply("You have already set an alert. You will be notified when it's time to redeem your daily reward.");
    }

    const now = new Date();
    const timeRemainingMs = cooldownDuration - (now - new Date(cooldownsFile[userId].lastClaimed));

    if (timeRemainingMs <= 0) {
      return interaction.reply("You can claim your daily reward now! Use the /daily command to claim it.");
    }

    setTimeout(async () => {
      const user = await client.users.fetch(userId);
      user.send("It's time to claim your daily reward! Use the /daily command to claim it.");
      cooldownsFile[userId].alertSet = false;
      fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));
    }, timeRemainingMs);

    cooldownsFile[userId].alertSet = true;
    fs.writeFileSync(cooldownsFilePath, JSON.stringify(cooldownsFile, null, 2));

    interaction.reply("You will be alerted when it's time to redeem your daily reward.");
  },
};