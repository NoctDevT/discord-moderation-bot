const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBalance } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("balance for user")
    .addUserOption((option) =>
      option.setName("target").setDescription("user to obtain balance from")
    ),

  async execute(interaction, client) {
    var user = interaction.options.getUser("target")
      ? interaction.options.getUser("target")
      : interaction.user;

    let balance = await getBalance(user.id);

    console.log({balance: balance})

    if (balance.length === 0) {
      var errMsg = interaction.options.getUser("target")
        ? `${user} is not registered, please use /register`
        : `You are not registered, please use /register`;
      return interaction.reply({
        content: errMsg,
        ephemeral: true,
      });
    }

    var msg = interaction.options.getUser("target")
      ? `${user} currently has ${balance[0].toLocaleString()} 💮 boba points`
      : `You currently have ${balance[0].toLocaleString()} 💮 boba points`;

    const embed = new EmbedBuilder()
      .setTitle(`Economy`)
      .setDescription(msg)
      .setColor(client.color)
      .setThumbnail(
        `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
      )
      .setTimestamp(Date.now());

    return interaction.reply({
      embeds: [embed],
    });
  },
};
