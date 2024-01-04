const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField, Permissions  } = require('discord.js');
const getRandomImage = require('../../helperFunctions/gojoImgs')
const checkVoicePerms = require('../../helperFunctions/checkVcPerms')
const replaceOwner = require('../../helperFunctions/transferVC')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('gojovctransfer')
          .setDescription('Locks the VC')
          .addUserOption((option) => option.setName('user').setDescription('Transfer vc control to this person').setRequired(true)),

          async execute(interaction, client){
          
            var img = getRandomImage()

            if(interaction.channel?.type !== 2){
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

            const user = interaction.options.getUser("user");
            const voiceChannelId = interaction.member.voice.channelId;

            var voiceChannel =
              interaction.guild.channels.cache.get(voiceChannelId);

            const userPermissions = voiceChannel.permissionsFor(
              interaction.member
            );

            var isVCOwner = await checkVoicePerms(interaction.user.id, voiceChannelId);
            if(isVCOwner === true) {

              console.log('hello')

              try {
                await replaceOwner(user.id, voiceChannelId);
                console.log('Owner ID replaced successfully');
              } catch (error) {
                console.error('Error replacing owner ID:', error.message);
              }
            // voiceChannel.permissionOverwrites.create(user, {
            //   ManageChannels: true
            // })

            // voiceChannel.permissionOverwrites.create(interaction.user, {
            //   ManageChannels: false
            // })

            const embed = new EmbedBuilder()
            .setTitle(`VC module`)
            .setDescription(`I've transfered the vc ownership to one king to another (${user})...`)
            .setColor(client.color)
            .setThumbnail(
                `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
            )
            .setTimestamp(Date.now())
            .setImage(img);
  
  

           return interaction.reply({
              embeds: [embed],
              });

            // interaction.reply({ content: `${user} is now the owner of the VC` });


          } else {

            const embed = new EmbedBuilder()
            .setTitle(`VC module`)
            .setDescription(`Hey.. I don't think this is your vc...`)
            .setColor(client.color)
            .setThumbnail(
                `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
            )
            .setTimestamp(Date.now());
  
  

         return  interaction.reply({
              embeds: [embed],
              });

            // interaction.reply({content:`This is not your vc, please ask the owner of the VC to run the command`})
          }
        
          }
}







// const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
// const userPermissions = voiceChannel.permissionsFor(interaction.member);



