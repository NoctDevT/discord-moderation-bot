const {
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  PermissionsBitField,
  Permissions,
} = require("discord.js");
const checkVoicePerms = require('../../helperFunctions/checkVcPerms')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gojovcban")
    .setDescription("Bans a user within the vc")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person who you want to ban from vc")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const voiceChannelId = interaction.member.voice.channelId;

    var voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);


    if (interaction.channel?.type !== 2) {
      return interaction.reply({
        content: `You are not using this command within a Gojo VC`,
      });
    }


    // const userPermissions = voiceChannel.permissionsFor(interaction.member);

    var isVCOwner = await checkVoicePerms(interaction.user.id, voiceChannelId);

    if(isVCOwner === true) {
      voiceChannel.permissionOverwrites.create(user.id, {
        ViewChannel: false,
      });

      const member = interaction.guild.members.cache.get(user.id);
      if (member.voice.channel && member.voice.channel.id === voiceChannel.id) {
        await member.voice.disconnect('User banned from the voice channel');
      }

     return interaction.reply({ content: `${user} has been banned from the VC` });
    } else {
     return interaction.reply({
        content: `This is not your vc, please ask the owner of the VC to run the command`,
      });
    }

  },
};
