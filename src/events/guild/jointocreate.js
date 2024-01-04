const {
  GuildMember,
  Embed,
  InteractionCollector,
  EmbedBuilder,
  Collection,
  PermissionsBitField,
  PermissionFlagsBits,
  VoiceChannel,
} = require("discord.js");
const voiceCollection = new Collection();
const fs = require("fs");

const {
  JTC_CATEGORY,
  JoinToCreateVC,
  EveryoneRole,
  unverifiedRole,
} = require("../../config/STATEVALUES");

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    try {
      if (oldChannel !== newChannel) {
        if (oldChannel) {
          const channel = oldState.channel;

          if (
            channel &&
            channel.parentId === JTC_CATEGORY &&
            channel.members.size === 0 &&
            channel.id != JoinToCreateVC
          ) {
            fs.readFile("src/events/guild/tempvcState.json", (err, data) => {
              if (err) throw err;
              const jsonData = JSON.parse(data);
              const index = jsonData.tempvc.findIndex(
                (entry) => entry.channeld === channel.id
              );
              if (index !== -1) {
                // Remove the value from the tempvc array
                jsonData.tempvc.splice(index, 1);
                // Write the updated object back to the file
                fs.writeFile(
                  "src/events/guild/tempvcState.json",
                  JSON.stringify(jsonData),
                  (err) => {
                    if (err) throw err;
                    console.log("Data written to file");
                  }
                );
              }
            });

            await channel.delete();
          }
        }
        if (newChannel) {
          if (newChannel?.id === JoinToCreateVC) {
            const guild = newState.guild;
            const categoryID = JTC_CATEGORY;
            const category = await newChannel.guild.channels.fetch(categoryID);

            let channelName = `>-${newState.member.user.username}'s Voice Channel`;

            if (categoryID) {
              // console.log({category: category})
              const channel = await newChannel.guild.channels.create({
                name: channelName,
                type: 2,
                userLimit: "5",
                bitrate: 160000,
                userLimit: 5,
                parent: category,
                permissionOverwrites: [
                  {
                    id: newState.member.user.id,
                    allow: [
                      PermissionsBitField.Flags.ViewChannel,
                      PermissionsBitField.Flags.ManageChannels,
                    ],
                  },
                  {
                    id: EveryoneRole,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: unverifiedRole,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                  },
                ],
              });
              // .then(channell=> channell.setParent(category))
              await newState.setChannel(channel);

              fs.readFile("src/events/guild/tempvcState.json", (err, data) => {
                if (err) throw err;
                const jsonData = JSON.parse(data);
                // jsonData.tempvc.push(channel.id)

                jsonData.tempvc.push({
                  channeld: channel.id,
                  ownerId: newState.member.user.id,
                });

                fs.writeFile(
                  "src/events/guild/tempvcState.json",
                  JSON.stringify(jsonData),
                  (err) => {
                    if (err) throw err;
                    console.log("Data written to file");
                  }
                );
              });
            }
          }
          // console.log(newChannel);
        }
      }
    } catch (e) {
      console.log("An error has occurred");
    }
  },
};
