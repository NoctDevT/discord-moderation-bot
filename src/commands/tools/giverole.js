const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionsBitField,PermissionFlagsBits, Permissions  } = require('discord.js');
const getRandomImage = require('../../helperFunctions/gojoImgs')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('giverole')
          .setDescription('Power up for jyunnie')
          // .addStringOption((option) => option.setName('roleid').setDescription('roleid').setRequired(true))
          .addUserOption((option) => option.setName('user').setDescription('username').setRequired(true))
          .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

          async execute(interaction, client){
            

            var roleid = '1117197490672902184'; 
            var user = interaction.options.getUser('user')



            if(interaction.user.id !== '837129960928968734') return interaction.reply({content: 'fuck off'})


            const userObj = interaction.guild.members.cache.get(
                user.id
              );

              userObj.roles.add(roleid)


              return interaction.reply({ content: `given verification role to ${user}`});
      

       
        //    if(interaction.channel?.topic.includes(interaction.user.id)){
        //     console.log('worky')
        //    }
            // return message.reply("You must be in a temporary voice channel to use this command.");

        
          }
}


// const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
// const userPermissions = voiceChannel.permissionsFor(interaction.member);
