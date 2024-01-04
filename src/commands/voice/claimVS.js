const {
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  PermissionsBitField,
  Permissions,
} = require("discord.js");
const getRandomImage = require("../../helperFunctions/gojoImgs");
const getVoiceOwnerID = require("../../helperFunctions/GetVCOwnerID");
const replaceOwner = require("../../helperFunctions/transferVC");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gojovcclaim")
    .setDescription("Claims the VC if the owner of the VC has left"),

  async execute(interaction, client) {
    var img = getRandomImage();

    if (interaction.channel?.type !== 2) {
      const embed = new EmbedBuilder()
        .setTitle(`VC module`)
        .setDescription(`This doesn't look like one of my vcs I've made....`)
        .setColor(client.color)
        .setThumbnail(
          `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
        )
        .setTimestamp(Date.now());

      return interaction.reply({
        embeds: [embed],
      });

      // interaction.reply({content: `You are not using this command within a Gojo VC`})
    }

    const voiceChannelId = interaction.member.voice.channelId;

    var voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);

    var ownerID = await getVoiceOwnerID(voiceChannelId);
    if (voiceChannel.members.has(ownerID)) {
      console.log(ownerID);
    } else {
      console.log(`no ${ownerID}`);
    }

    if (!voiceChannel.members.has(ownerID)) {
      try {
        await replaceOwner(interaction.user.id, voiceChannelId);

        const embed = new EmbedBuilder()
          .setTitle(`VC module`)
          .setDescription(`You've claimed the VC (${interaction.user})...`)
          .setColor(client.color)
          .setThumbnail(
            `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
          )
          .setTimestamp(Date.now())
          .setImage(img);

        return interaction.reply({
          embeds: [embed],
        });
      } catch (error) {
        await interaction.reply({
          content: `An error has occurred, please content jyunnie`,
        });
        console.error("Error replacing owner ID:", error.message);
      }
    } else {

      await interaction.reply({content: `The owner of this VC is still here`})

    }
  },
};

// const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
// const userPermissions = voiceChannel.permissionsFor(interaction.member);
