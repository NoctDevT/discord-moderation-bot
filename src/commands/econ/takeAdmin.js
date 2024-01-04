const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  getBalance,
  sendMoney,
  takeMoney,
} = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("take")
    .setDescription("take money from user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user to take money from")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("amount to take")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    var user = interaction.options.getUser("target");
    var amt = interaction.options.getInteger("amount");
    var msg = ``;

    const message = await interaction.deferReply({
      fetchReply: true
    }); 

    let balance = await getBalance(user.id);

    if (balance.length === 0) {
      var errMsg = interaction.options.getUser("target")
        ? `${user} is not registered, please use /register`
        : `You are not registered, please use /register`;
      return interaction.editReply({
        content: errMsg,
            ephemeral: true, // Make the reply ephemeral to only show to the command invoker
      });
    }

    if (balance[0] < amt) {
      const embed2 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(`This user has insufficient funds`)
        .setColor(client.color)
        .setThumbnail(
          `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
        )
        .setTimestamp(Date.now());

      return interaction.editReply({
        embeds: [embed2],
      });
    }

    try {
       takeMoney(user.id, amt);
      let msg = `You have taken ${amt} 💮 boba points from ${user}`;
      const embed3 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(msg)
        .setColor(client.color)
        .setThumbnail(
          `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
        )
        .setTimestamp(Date.now());

      interaction.editReply({
        embeds: [embed3],
      });
    } catch (err) {
      let msg = `Error with the DB, please contact Jyunnie`;
      const embed4 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(msg)
        .setColor(client.color)
        .setThumbnail(
          `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
        )
        .setTimestamp(Date.now());

      interaction.editReply({
        embeds: [embed4],
      });
    }
  },
};
