
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
         .setName('permcheck')
         .setDescription('Check Permissions')
         .addUserOption(option => option.setName('target').setDescription('Ban Target').setRequired(true))
         .addStringOption(option => option.setName('reason').setDescription('Reason for ban').setRequired(true))
         .addBooleanOption(option => option.setName('preserve_message').setDescription('Preserve all messages').setRequired(true))
         .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

          async execute(interaction, client){

            const embed = new EmbedBuilder()
            .setTitle(`Permission check`)
            .setDescription(`You have the ability to run all commands that allow for banning.`)
            .setColor(client.color)
            // .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
            .setTimestamp(Date.now())

            await interaction.reply({
              embeds: [embed]
            })
          }
}
