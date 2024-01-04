const {
  GuildMember,
  Embed,
  InteractionCollector,
  EmbedBuilder,
  WelcomeChannel,
} = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // console.log(message.author.bot)

    if (message.author.bot) return;

    // if (client.tfjs_toxicModel == undefined) return;

    const regex = /#(\s\w+)/;

    if (regex.test(message.content) === true) {
      try {
        await message.delete();
        await message.author.send(
          `This command has been disabled within the server.`
        );
      } catch (e) {
        console.error(e);
      }
    }

    // // console.log(message.content);

    // const predictions = await client.tfjs_toxicModel.classify([message.content]);

    // // console.log(predictions);

    // const toxicLabels = predictions.filter(p => p.results[0].match);

    // if (toxicLabels.length > 0) {
    //   const labelString = toxicLabels.map(l => `${l.label} (${(l.results[0].probabilities[1] * 100).toFixed(2)}%)`).join(', ');
    //   message.reply(`${labelString}.`);
    // } else {
    //     return
    // }

    // const {user, guild} = member;
    // const welcomeChannel = member.guild.channels.cache.get('988082473676181545');

    // var percentage = Math.floor(Math.random() * 100) + 1
    // var percentage2 = Math.floor(Math.random() * 100) + 1

    // if(percentage > 98 && percentage2 > 80) {

    //     const embed = new EmbedBuilder()
    //     .setTitle(`Fun event! Give Sim some hair and win a prize out of it!`)
    //     .setDescription(`Give this beast (<@286339659250794496>) some hair win a prize. Post entries into the <#1024353959063851108> Best entry wins 20k currency`)
    //     .setColor(client.color)
    //     .setImage(`https://cdn.discordapp.com/attachments/843259868155478097/1024354215079977050/unknown.png`)
    //     .setTimestamp(Date.now())

    //     welcomeChannel.send({embeds: [embed]});

    // }

    // welcomeChannel.send(`<@${member.id}> just deleted a message. What a loser`);
  },
};
