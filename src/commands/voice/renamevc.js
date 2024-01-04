const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');
const channelsOnCooldown = new Set();
const getRandomImage = require('../../helperFunctions/gojoImgs')
const checkVoicePerms = require('../../helperFunctions/checkVcPerms')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('gojovcrename')
          .setDescription('Renames the voice chat')
          .addStringOption((option) => option.setName('vcname').setDescription('New VC name').setRequired(true)),

          async execute(interaction, client){
            var img = getRandomImage()


            if(interaction.channel?.type !== 2){
              const embed = new EmbedBuilder()
              .setTitle(`VC module`)
              .setDescription(`Bud you gotta use this in MY vc's`)
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
            const newName = interaction.options.getString("vcname");
            const voiceChannelId = interaction.member.voice.channelId;
            var voiceChannel =
              interaction.guild.channels.cache.get(voiceChannelId);

            // const userPermissions = voiceChannel.permissionsFor(
            //   interaction.member
            // );

            var isVCOwner = await checkVoicePerms(interaction.user.id, voiceChannelId);

          if(isVCOwner === true) {
            if (channelsOnCooldown.has(voiceChannel.id)) {

              const embed = new EmbedBuilder()
              .setTitle(`VC module`)
              .setDescription(`I'll rename it later give me a min`)
              .setColor(client.color)
              .setThumbnail(
                  `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
              )
              .setTimestamp(Date.now());
    
    

            return interaction.reply({
                embeds: [embed],
                });
            }

            await voiceChannel.edit({ name: newName });


            const embed = new EmbedBuilder()
            .setTitle(`VC module`)
            .setDescription(`I've changed the vc name to ${newName}...`)
            .setColor(client.color)
            .setThumbnail(
                `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
            )
            .setTimestamp(Date.now())
            .setImage(img);
  
            channelsOnCooldown.add(voiceChannel.id);

            setTimeout(() => {
              channelsOnCooldown.delete(voiceChannel.id);
            }, 30 * 1000);
        

           return interaction.reply({
              embeds: [embed],
              });

            // interaction.reply({ content: `VC name set to ${newName}` });
            
  

          } else {

            const embed = new EmbedBuilder()
              .setTitle(`VC module`)
              .setDescription(`Idk.. I don't take instructions from anyone but the owner of this vc 😤😤😤`)
              .setColor(client.color)
              .setThumbnail(
                  `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
              )
              .setTimestamp(Date.now());
    
    

             interaction.reply({
                embeds: [embed],
                });

            // interaction.reply({content:`This is not your vc, please ask the owner of the VC to run the command`})
          }
 
          }
}


// const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
// const userPermissions = voiceChannel.permissionsFor(interaction.member);
