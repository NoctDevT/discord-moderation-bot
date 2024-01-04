const { SlashCommandBuilder, EmbedBuilder, Embed, Message, ActionRowBuilder, ButtonBuilder,   ButtonStyle } = require('discord.js');
const {addConfession, checkIfDiscordIDExists } = require('../../database/dbService')
const getRandomImage = require('../../helperFunctions/randomKawaiiImg')

var randomMessages = [
    'Hewwoo masturr >_<',
    'UGUUU mastuhh 0w0',
    'Nyaaaaa >@.@< hewoo',
    'OwO hewooo',
    'nyaa nyaaa hewwo',
    '*sniffs* hewwo '
]

function getRandomMessage() {
    // Get a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
  
    // Return the image URL at the random index
    return randomMessages[randomIndex];
  }
  


module.exports = {
    data: new SlashCommandBuilder()
          .setName('owofy')
          .setDescription('Super Secret Command')
          .addUserOption((option) => option.setName('user').setDescription('user to owo').setRequired(true)),

          async execute(interaction, client){

            var img = getRandomImage()



            if(interaction.user.id == '767589425135353876'){

                const embed = new EmbedBuilder()
                .setTitle(`owofied`)
                .setDescription(`This you? %<@${interaction.user.id}>`)
                .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
                .setImage(img)
                .setColor(client.color)
                .setTimestamp(Date.now())
    
                return interaction.reply({ embeds: [embed] });

            }


            var userID = interaction.options.getUser('user')
            var user = await client.users.fetch(userID)
            var owoString =   `<@${user.id}> says ` + getRandomMessage(randomMessages)

            const embed = new EmbedBuilder()
            .setTitle(`owofied`)
            .setDescription(owoString)
            .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
            .setImage(img)
            .setColor(client.color)
            .setTimestamp(Date.now())

            console.log({embed})

            return interaction.reply({ embeds: [embed] });

          }
}




