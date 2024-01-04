
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder  } = require('discord.js');
const {addNote} = require("../../database/dbService")



module.exports = {
    data: new SlashCommandBuilder()
         .setName('setnote')
         .setDescription('set a note for a user')
         .addUserOption(option => option.setName('target').setDescription('note Target').setRequired(true))
         .addStringOption(option => option.setName('note').setDescription('note for a user').setRequired(true))
         .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

          async execute(interaction, client){


            const now = new Date();
            const year = now.getUTCFullYear();
            const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = now.getUTCDate().toString().padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            

            var noteObj = {
                type: "note",
                user:{
                    discordID: interaction.options.getUser('target').id,
                    note: interaction.options.getString('note'),
                    staffName: interaction.user.username,
                    staffId: interaction.user.id,
                    date: dateStr
                }
                
            }

   

            addNote(noteObj).then(res => {
                const embed = new EmbedBuilder()
                .setTitle(`Mod notes`)
                .setDescription(`Member <@${noteObj.user.discordID}>'s ${res}`)
                .addFields(
                    {name: 'Note', value: `${noteObj.user.note}`},
                    {name: 'Note set by', value: `<@${noteObj.user.staffName}>`}
                )
                .setColor(client.color)
                .setThumbnail(`https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg`)
                .setTimestamp(Date.now())
    
                 interaction.reply({
                  embeds: [embed]
                })
            }).catch((err) => {


                console.log(err)

                const embed = new EmbedBuilder()
                .setTitle(`Mod notes`)
                .setDescription(`Error posting to database`)
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



