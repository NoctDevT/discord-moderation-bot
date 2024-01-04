const { SlashCommandBuilder, EmbedBuilder, Embed, Message, ActionRowBuilder, ButtonBuilder,   ButtonStyle } = require('discord.js');
const {addConfession, checkIfDiscordIDExists } = require('../../database/dbService')

module.exports = {
    data: new SlashCommandBuilder()
          .setName('confession')
          .setDescription('Super Secret Command')
          .addStringOption((option) => option.setName('confession').setDescription('Confession to send').setRequired(true)),

          async execute(interaction, client){

            let doesExist = await checkIfDiscordIDExists(interaction.user.id)

            if (!doesExist) {
              var errMsg = interaction.options.getUser("target")
                ? `${user} is not registered, please use /register`
                : `You are not registered, please use /register`;
              return interaction.reply({
                content: errMsg,
                ephemeral: true,
              });
            } 

        
            const message = interaction.options.getString('confession');

            var channel = await client.channels.fetch('1102927797690830930');

            const idPattern = /<@(\d+)>/;
            
            if(message.includes('<@')) return await interaction.reply({content: `For now, mentioning other users has been disabled.`, ephemeral: true})

            var confessionID = await addConfession(interaction.user.id, message)

            let embedMsg = `confession: ${message}` 

            const embed = new EmbedBuilder()
            .setTitle(`Confession ID:#${confessionID}`)
            .setDescription(embedMsg)
            .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
            .setColor(client.color)
            .setTimestamp(Date.now())


           var button1 = new ButtonBuilder()
            .setCustomId("approveConfession2")
            .setLabel("Approve!")
            .setStyle(ButtonStyle.Primary)

           var button2 = new ButtonBuilder()
            .setCustomId("RejectConfession")
            .setLabel("Reject!")
            .setStyle(ButtonStyle.Secondary)

            var buttons = [button1, button2]
        

            const actionRow = new ActionRowBuilder()
            .addComponents(buttons);


            await channel.send({embeds: [embed], components: [actionRow]})

                  return await interaction.reply({content: `Sent confession, please wait for a reply`,  ephemeral: true
                  })

          }
}


