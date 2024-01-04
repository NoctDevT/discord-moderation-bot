
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
         .setName('createverify')
         .setDescription('set a verification channel')
         .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

          async execute(interaction, client){

            const embed = new EmbedBuilder()
            .setTitle(`Welcome to Boba Express`)
            .setDescription(`This is an SFW 18+ Server, only continue if you're 18+. Click the second button on this embed to continue.`)
            .setColor(client.color)
            .setImage(`https://cdn.discordapp.com/attachments/988082473676181545/1094815852022476820/9a5d41347a3a3f90d1ef8a4e524fcc1c862d4ac78d93b49a457a74d8073a2631.png`)
            .setFooter({
                text: `- Admin Team`
            })
            .setTimestamp()

          const buttons =  new ActionRowBuilder()
          .addComponents(
              new ButtonBuilder()
              .setCustomId('DummyBtn')
              .setLabel('YIKES!')
              .setStyle(ButtonStyle.Primary)
          )
          .addComponents(
              new ButtonBuilder()
              .setCustomId('verificationBtn')
              .setLabel('ENTER!')
              .setStyle(ButtonStyle.Success)            
          );

              // new ButtonBuilder()
              // .setCustomId('verificationBtn')
              // .setLabel('ENTER!')
              // .setStyle(ButtonStyle.Secondary)

            await interaction.S({
              embeds: [embed],
              components: [buttons]
            })


            //DB CONNECTION FUNCTION



          }
}


