const { SlashCommandBuilder, EmbedBuilder, Embed, Message, ActionRowBuilder, ButtonBuilder,   ButtonStyle } = require('discord.js');
const {addConfession, checkIfDiscordIDExists, getTopBalances } = require('../../database/dbService')

  


module.exports = {
    data: new SlashCommandBuilder()
          .setName('baltop')
          .setDescription('Super Secret Command'),

          async execute(interaction, client){
            
            const topBalances = await getTopBalances();
            const fields = await Promise.all(topBalances.map(async (row, index) => ({
                name: `${index + 1}. ${(await client.users.fetch(row.discordID)).username}`,
                value: `${row.currency.toLocaleString()}💮`
            })));

            const embed = new EmbedBuilder()
            .setTitle('Baltop 5')
            .setColor(client.color)
            .setDescription('Here are the top 5 richest users')
            .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
            .addFields(fields)
            .setTimestamp(Date.now())


            return interaction.reply({ embeds: [embed] });

          }
}




