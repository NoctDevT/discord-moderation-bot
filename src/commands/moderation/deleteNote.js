const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getNote, deleteNote } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletenote")
    .setDescription("retrieving note for user")
    .addUserOption((option) =>
      option.setName("target").setDescription("note Target").setRequired(true)
    )
    .addNumberOption((option) => 
     option.setName("notenumber").setDescription("note number to delete").setRequired(true))
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
        }



            var match = false;

            res.map((item, index) => {

                const deleteIndex = interaction.options.getNumber("notenumber") - 1;

                if(index === deleteIndex){
                    match = deleteNote(item.noteID);

                    const embed = new EmbedBuilder()
                        .setTitle(`Mod notes`)
                        .setDescription(`Deleted note`)
                        .setColor(client.color)
                        .setThumbnail(
                            `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
                        )
                        .setTimestamp(Date.now());

                        interaction.reply({
                        embeds: [embed],
                        });
                }    

                console.log(index + 1)
                console.log(res.length)
                
                if(index + 1 === res.length) {
                    

                    if(match == false) { 
                    const embed = new EmbedBuilder()
                    .setTitle(`Mod notes`)
                    .setDescription(`Note not found, please double check the note number provided.`)
                    .setColor(client.color)
                    .setThumbnail(
                        `https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`
                    )
                    .setTimestamp(Date.now());

                    interaction.reply({
                    embeds: [embed],
                    });
                }
                }

            })
      })
      .catch((err) => {
        const embed = new EmbedBuilder()
          .setTitle(`Mod notes`)
          .setDescription(`Connection to DB down, please contact Jyunnie`)
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
