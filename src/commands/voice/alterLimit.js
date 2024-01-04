const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');
const checkVoicePerms = require('../../helperFunctions/checkVcPerms')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('gojovclimit')
          .setDescription('Alters the size of the vc')
          .addStringOption((option) => option.setName('size').setDescription('The maximum amount of people who can join').setRequired(true)),

          async execute(interaction, client){
            if(interaction.channel?.type !== 2){
             return interaction.reply({content: `You are not using this command within a Gojo VC`})
             }
            var vcLimit =  interaction.options.getString('size');

            const voiceChannelId = interaction.member.voice.channelId;

            var voiceChannel =
              interaction.guild.channels.cache.get(voiceChannelId);

            const userPermissions = voiceChannel.permissionsFor(
              interaction.member
            );


            
            var isVCOwner = await checkVoicePerms(interaction.user.id, voiceChannelId);


          if(isVCOwner === true) {
            
            const memberCount = vcLimit;
            voiceChannel.setUserLimit(memberCount)
            .then(updatedChannel => {
             return interaction.reply(`Updated user limit for channel ${updatedChannel.name} to ${memberCount}.`);
            }).catch(err => {
              return  interaction.reply(`error this comamnd no worky msg jyunnie 3`)
            })

          } else {
            return interaction.reply({content:`This is not your vc, please ask the owner of the VC to run the command`})
          }
    



        //    if(interaction.channel?.topic.includes(interaction.user.id)){
        //     console.log('worky')
        //    }
            // return message.reply("You must be in a temporary voice channel to use this command.");

        
          }
}


// const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
// const userPermissions = voiceChannel.permissionsFor(interaction.member);


