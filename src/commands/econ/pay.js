const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBalance, sendMoney } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("balance for user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("user to send money to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("amount to send")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    var amt = interaction.options.getInteger("amount");
    var user = interaction.options.getUser("target");

    if(user.id === interaction.user.id){
     return interaction.reply({
        content: `You can't give yourself money you silly goober!`
      })
    }

    let embed1 = new EmbedBuilder()
      .setTitle(`Economy`)
      .setColor(client.color)
      .setThumbnail(
        `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
      )
      .setDescription(` You can't pay someone negative money`)
      .setTimestamp(Date.now());

      console.log(amt)

    // if (amt.includes("-")) {
    //   return interaction.editReply({
    //     embeds: [embed1],
    //   });
    // }

    const message = await interaction.deferReply({
      fetchReply: true
    }); 

    let balance = await getBalance(interaction.user.id);

    if (balance.length === 0) {
      var errMsg = interaction.options.getUser("target")
        ? `${user} is not registered, please use /register`
        : `You are not registered, please use /register`;
        return interaction.editReply({
        content: errMsg,
        ephemeral: true, // Make the reply ephemeral to only show to the command invoker
      });
    }


    if (balance[0] <amt) {
      const embed2 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(`${interaction.user}, you have insufficient funds`)
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
      await sendMoney(interaction.user.id, user.id, amt);
      let msg = `You have sent ${amt} 💮 boba points to ${user}`;
      const embed3 = new EmbedBuilder()
        .setTitle(`Economy`)
        .setDescription(msg)
        .setColor(client.color)
        .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
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
        .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
        .setTimestamp(Date.now());
    
      interaction.editReply({
        embeds: [embed4],
      });
    }

    // getBalance(user.id).then((res) => {
    //   if (res.length > 0) {

    //     if(res < amt){

    //         const embed = new EmbedBuilder()
    //             .setTitle(`Economy`)
    //             .setDescription(msg)
    //             .setColor(client.color)
    //             .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
    //             .setTimestamp(Date.now())

    //             interaction.reply({
    //             embeds: [embed]
    //             })
    //     }

    //     sendMoney(interaction.user.id, user.id, amt ).then((res) => {
    //         if(res === true){
    //              msg = `You have sent ${res} 💮 boba points to ${user}`
    //         } else {
    //              msg = `Error with the DB, please contact Jyunnie`

    //         }
    //     })

    //    const embed = new EmbedBuilder()
    //   .setTitle(`Economy`)
    //   .setDescription(msg)
    //   .setColor(client.color)
    //   .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
    //   .setTimestamp(Date.now())

    //    interaction.reply({
    //     embeds: [embed]
    //   })
    //   } else {
    //     var errMsg = interaction.options.getUser("target") ? `${user} is not registered, please use /register` : `You are not registered, please use /register`;
    //     interaction.reply({
    //       content: errMsg,
    //       ephemeral: true // Make the reply ephemeral to only show to the command invoker
    //     });
    //   }
    // }).catch((err) => {
    //   console.error(err);
    //   // Handle the error as needed, such as displaying an error message to the user
    // })
  },
};


