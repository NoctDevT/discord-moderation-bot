// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  getBalance,
  awardMoney,
  takeMoney,
} = require("../../database/dbService");
const {
  maxWinAmount,
  winMultiplier,
  successRate,
} = require("../../config/STATEVALUES.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("gamble")
//     .setDescription("gamble your money")
//     .addIntegerOption((option) =>
//       option
//         .setName("amount")
//         .setDescription("Amount of money you wish to gamble")
//         .setRequired(true)
//     ),
//   async execute(interaction, client) {
//     var user = interaction.user;
//     var money = interaction.options.getInteger("amount");

//     console.log("running 0");
//     let balance = await getBalance(user.id);
//     console.log("running 1");

//     if (balance.length === 0) {
//       var errMsg = user
//         ? `${user} is not registered, please use /register`
//         : `You are not registered, please use /register`;
//       return interaction.reply({
//         content: errMsg,
//         ephemeral: true,
//       });
//     }

//     var amt = money;

//     if (amt > balance[0]) {
//       return interaction.reply({
//         content: `You do not have enough stamps💮 to gamble`,
//       });
//     }

//     var takemoneyRes = await takeMoney(interaction.user.id, amt);

//     if (takemoneyRes == false) {
//       return interaction.reply({ content: `Error, please contact Jyunnie` });
//     }

//     var gambleRes = gamble(amt);

//     if (gambleRes == 0) {
//       return interaction.reply({ content: `You didn't win anything` });
//     }

//     var res = await awardMoney(interaction.user.id, gambleRes + amt);

//     if (res == false) {
//       return interaction.reply({ content: `Error, please message Jyunnie` });
//     }

//     return interaction.reply({
//       content: `You have won ${gambleRes - amt}💮 through gambling!`,
//     });

//     // var msg = interaction.options.getUser("target")
//       //   ? `${user} currently has ${balance[0].toLocaleString()} 💮 boba points`
//       //   : `You currently have ${balance[0].toLocaleString()} 💮 boba points`;

//       // const embed = new EmbedBuilder()
//       //   .setTitle(`Economy`)
//       //   .setDescription(msg)
//       //   .setColor(client.color)
//       //   .setThumbnail(
//       //     `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
//       //   )
//       //   .setTimestamp(Date.now());

//       // return interaction.reply({
//       //   embeds: [embed],
//       // });
//   },
// };

// function gamble(money) {
//   const random = Math.random();
//   if (random <= successRate) {
//     const winnings = Math.round(Math.random() * maxWinAmount);
//     const totalWinnings = winnings > money ? money : winnings;
//     return money + totalWinnings * winMultiplier;
//   } else {
//     return 0;
//   }
// }

function getMoney(money) {
  const winnings = Math.round(Math.random() * maxWinAmount);
  const totalWinnings = winnings > money ? money : winnings;
  return money + totalWinnings * winMultiplier;
}

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "bet",
  description: "Bet cents on a coinflip!",
  usage: "/bet <side> <amount>",
  cooldown: { time: 30, text: "30 Seconds" },
  defer: { defer: true, ephemeral: false },
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Bets cents on a coinflip!")
    .setDMPermission(true)

    .addStringOption((option) =>
      option
        .setName("side")
        .setDescription("Heads or tails!")
        .setRequired(true)
        .addChoices(
          { name: "heads", value: "heads" },
          { name: "tails", value: "tails" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How much are you betting?")
        .setRequired(true)
        .setMaxValue(1_000_000)
        .setMinValue(50)
    ),

  execute: async (interaction, client) => {
    var user = interaction.user;
    var money = interaction.options.getInteger("amount");

    console.log("running 0");
    let balance = await getBalance(user.id);
    console.log("running 1");

    if (balance.length === 0) {
      var errMsg = user
        ? `${user} is not registered, please use /register`
        : `You are not registered, please use /register`;
      return interaction.reply({
        content: errMsg,
        ephemeral: true,
      });
    }

    var amt = money;

    if (amt > balance[0]) {
      return interaction.reply({
        content: `You do not have enough stamps💮 to gamble`,
      });
    }
    const bet = interaction.options.getString("side");

    const boolean = Math.floor(Math.random() * 100) > 65;
    const embed = new EmbedBuilder()
      .setTitle("Coinflip")
      .setColor("Orange")
      .setThumbnail(
        `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
      )
      .setDescription(
        `You put your chances on ${interaction.options.getString("side")}`
      );

    const reply = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    /* Did they win? */
    if (boolean == true) {
      // if (userData.settings.evil == true) amount = Math.floor(amount * 0.75);

      let winAmt = Math.round(getMoney(amt));

      console.log({ winAmt });

      try {
        await awardMoney(user.id, Number(winAmt));
        console.log("Won");

        embed.setDescription(`${user}, You won ${winAmt}💮!`);
        embed.setTitle("The coin landed on " + bet + "!");
      } catch (e) {
        embed.setTitle("An error has occurred");
        console.error(e);
      }
    } else {
      /* Remove the money from their account */

      try {
        await takeMoney(user.id, Number(amt));

        embed.setDescription(`${user}, You lost  ${amt}💮`);
        embed.setTitle(
          "The coin landed on " + (bet == "points" ? "tails!" : "heads!")
        );
      } catch (e) {
        embed.setTitle("An error has occurred");
      }

      // await database.setValue(
      // 	'users',
      // 	interaction.user.id,
      // 	(userData.stats.balance == 0 ? await achievementAdd(userData, 'justMyLuck', client) : userData),
      // );
    }

    await reply.edit({ embeds: [embed] });
  },
};
