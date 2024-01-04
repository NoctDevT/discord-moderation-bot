const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getNote } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getnote")
    .setDescription("retrieving note for user")
    .addUserOption((option) =>
      option.setName("target").setDescription("note Target").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("target");

    getNote(user.id)
      .then((res) => {



        if(res.length === 0) {
          const embed = new EmbedBuilder()
          .setTitle(`Mod notes`)
          .setDescription(`There are no notes for this user`)
          .setColor(client.color)
          .setThumbnail(
              `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
          )
          .setTimestamp(Date.now());

          interaction.reply({
          embeds: [embed],
          });
          return;
      }



        const embed = new EmbedBuilder()
          .setTitle(`Mod notes for ${user.username}`)
          .setColor(client.color)
          .setThumbnail(
            `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
          )
          .setTimestamp()
          .addFields(
            res.map((item, index) => {
              
              return [
                {
                    name: `Note ${index + 1}`,
                    value: item.note,
                    inline: true
                },
                {
                    name: `Author`,
                    value: `<@${item.note_author}>`,
                    inline: true
                },
                {
                  name: `Date`,
                  value: `${item.date}`,
                  inline: true
                }
            ];
        }).flat()
             
          

         
          );

        interaction.reply({
          embeds: [embed],
        });
      })
      .catch((err) => {
        const embed = new EmbedBuilder()
          .setTitle(`Mod notes`)
          .setDescription(`Error retrieving from database`)
          .setColor(client.color)
          .setThumbnail(
            `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
          )
          .setTimestamp(Date.now());

        interaction.reply({
          embeds: [embed],
        });
        console.log(err);
      });
  },
};




