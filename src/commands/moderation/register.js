
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder  } = require('discord.js');
const {register} = require("../../database/dbService")

module.exports = {
    data: new SlashCommandBuilder()
         .setName('register')
         .setDescription('register')
         .addUserOption(option => option.setName('target').setDescription('Register a user').setRequired(true)),
        //  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

          async execute(interaction, client){

            var registerObj = {

                    discordID: interaction.options.getUser('target').id,
                    punishmentLevel: 0,
                    isBanned: 0,
            }

            
            register(registerObj).then(res => {
              const embed = new EmbedBuilder()
              .setTitle(`Registed to DB`)
              .setDescription(`Member <@${registerObj.discordID}> ${res}`)
              .setColor(client.color)
              .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
              .setTimestamp(Date.now())
  
               interaction.reply({
                embeds: [embed]
              })
            }).catch(err => {

              const embed = new EmbedBuilder()
              .setTitle(`Registed to DB`)
              .setDescription(`Member <@${registerObj.discordID}> ${err}`)
              .setColor(client.color)
              .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
              .setTimestamp(Date.now())
  
               interaction.reply({
                embeds: [embed]
              })
            })



           


            //DB CONNECTION FUNCTION



          }
}