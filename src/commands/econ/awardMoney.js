const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const { getBalance, sendMoney, awardMoney, checkIfDiscordIDExists, } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("award")
    .setDescription("award money to user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user to award money to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("amount to award")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


  async execute(interaction, client) {
    var amt = interaction.options.getInteger("amount");
    var user = interaction.options.getUser("target");

    let embed1 = new EmbedBuilder()
      .setTitle(`Economy`)
      .setColor(client.color)
      .setThumbnail(
        `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
      )
      .setDescription(` You can't award someone negative money`)
      .setTimestamp(Date.now());

  

    let doesExist = await checkIfDiscordIDExists(interaction.user.id);

    if (!doesExist) {
      var errMsg = `You are not registered, please use /register`;
     return interaction.reply({
       content: errMsg,
       ephemeral: true,
     });
   }




    try {
      await awardMoney( user.id, amt);
      let msg = `You have awarded ${amt} 💮 boba points to ${user}`;
      const embed3 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(msg)
        .setColor(client.color)
        .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
        .setTimestamp(Date.now());
    
      interaction.reply({
        embeds: [embed3],
      });
    } catch (err) {
      let msg = `Error with the DB, please contact Bot owner`;
      const embed4 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(msg)
        .setColor(client.color)
        .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
        .setTimestamp(Date.now());
    
      interaction.reply({
        embeds: [embed4],
      });
    }
  },
};


