const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getAllRolesFromDb } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listdbroles")
    .setDescription("retrieves all roles linked to db")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => 
        option.setName('category')
            .setDescription('The gif category')
            .setRequired(true)
            .addChoices(
                {name: 'Gaming', value: 'Gaming'},
                {name: 'Arts', value: 'Arts'},
                {name: 'Age', value: 'Age'},
                {name: 'Gender', value: 'Gender'},
                {name: 'Country', value: 'Country'},
                {name: 'Interest', value: 'Interests'},
                {name: 'PartyGames', value: 'PartyGames'},
                {name: 'Pings', value: 'Pings'},
                {name: 'Color', value: 'Colour'}
            )),

  async execute(interaction, client) {

    var category = interaction.options.getString('category');


    try{
        const dbRoles = await getAllRolesFromDb(category);

        const itemsPerPage = 10; // Number of items to display per page
        const totalPages = Math.ceil(dbRoles.length / itemsPerPage); // Calculate the total number of pages
        let currentPage = 1; // Current page number
        let startIndex = (currentPage - 1) * itemsPerPage; // Calculate the starting index of items for the current page
        let endIndex = startIndex + itemsPerPage; // Calculate the ending index of items for the current page
        

        const fields = dbRoles.slice(startIndex, endIndex).map((row, index) => ({
            name: `Role ${startIndex + index + 1}`,
            value: `RoleID: ${row.roleID}\nRoleName: ${row.roleName}\nEmoteID: ${row.emoteID}`,
            inline: true
          }));

        const embed = new EmbedBuilder()
        .setTitle('Roles')
        .setDescription('The current roles registered to the DB')
        .addFields(fields)
        .setColor(client.color)
        .setThumbnail(
            `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
          )

        console.log(embed.fields)


        const reply = await interaction.reply({embeds: [embed], fetchReply: true })



        await reply.react('⬅️'); // Add reaction for previous page
        await reply.react('➡️'); // Add reaction for next page

        const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
        const collector = reply.createReactionCollector({ filter, time: 60000 });


        collector.on('collect', async (reaction, user) => {
            // Handle previous page reaction
            if (reaction.emoji.name === '⬅️') {
              if (currentPage > 1) {
                currentPage--;
                startIndex = (currentPage - 1) * itemsPerPage;
                endIndex = startIndex + itemsPerPage;
                fields.length = 0;
                fields.push(...dbRoles.slice(startIndex, endIndex).map((row, index) => ({
                  name: `Role ${startIndex + index + 1}`,
                  value: `RoleID: ${row.roleID}\nRoleName: ${row.roleName}\nEmoteID: ${row.emoteID}`,
                  inline: true
                })));
              }
            }

  // Handle next page reaction
  if (reaction.emoji.name === '➡️') {
    if (currentPage < totalPages) {
      currentPage++;
      startIndex = (currentPage - 1) * itemsPerPage;
      endIndex = startIndex + itemsPerPage;
      fields.length = 0;


      console.log('test')
      console.log({startIndex, endIndex})

      fields.push(...dbRoles.slice(startIndex, endIndex).map((row, index) => ({
        name: `Role ${startIndex + index + 1}`,
        value: `RoleID: ${row.roleID}\nRoleName: ${row.roleName}\nEmoteID: ${row.emoteID}`,
        inline: true
      })));
      
    }
  }
  await reaction.users.remove(user.id);


  embed.setDescription(`Page ${currentPage}/${totalPages}\nThe current roles registered to the DB`);
  // console.log(embed)
  embed.fields = fields; 
  // embed.addFields(fields);
  await reply.edit({ embeds: [embed] });
});

            


    }catch(e){
        console.error(e)
        await interaction.reply({content: `An error has occured: e`})
    }


    }
}