const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');
const checkVoicePerms = require('../../helperFunctions/checkVcPerms')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('gojovcunban')
          .setDescription('Unbans a user from the vc')
          .addUserOption((option) => option.setName('user').setDescription('The person who you want to unban from vc').setRequired(true)),

          async execute(interaction, client){

            const user = interaction.options.getUser('user');

            const voiceChannelId = interaction.member.voice.channelId;

            var voiceChannel =
              interaction.guild.channels.cache.get(voiceChannelId);

            const userPermissions = voiceChannel.permissionsFor(
              interaction.member
            );


            if (interaction.channel?.type !== 2) {
              return interaction.reply({
                content: `You are not using this command within a Gojo VC`,
              });
            }
            
            var isVCOwner = await checkVoicePerms(interaction.user.id, voiceChannelId);
            if(isVCOwner === true) {

            var oldperms = voiceChannel.permissionOverwrites.cache;


            voiceChannel.permissionOverwrites.create(user, {
                ViewChannel: true
            }
            
            );

            return interaction.reply({content:`${user} has been unbanned from the VC`})


          } else {
           return interaction.reply({content:`This is not your vc, please ask the owner of the VC to run the command`})
          }
          //  if(interaction.channel?.type !== 2){
          //   interaction.reply({content: `You are not using this command within a Gojo VC`})
          //  }
          }
}

