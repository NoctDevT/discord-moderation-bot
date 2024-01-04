const {GuildMember, Embed, InteractionCollector, EmbedBuilder} = require("discord.js");

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user, client) {   

        if(reaction.message.channelId != '988082473676181545') return;
        let channel = client.channels.cache.get(reaction.message.channelId);

       if(user === '837129960928968734') return;

    //    if(reaction.emoji.name === "💀" && user.id === '440524066181480458') channel.send({content: `${user} is a loser`})
    //    if(reaction.emoji.name === "💀") channel.send({content: `${user} is a loser`})

       if(reaction.emoji.name === "smiling_imp" && user.id === '373247342457126914') channel.send({content: `${user} is a king 🔥💯🐐`})

       


    }
}
