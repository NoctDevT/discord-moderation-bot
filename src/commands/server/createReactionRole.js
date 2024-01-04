const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {addRoleToDb} = require('../../database/dbService')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rolemanager")
    .setDescription("adding role to bot")
    .addStringOption((option) => option.setName("emote").setDescription('Emote to react to').setRequired(true))
    .addRoleOption((option) => option.setName("roleid").setDescription('The role attached to this emote').setRequired(true))
    .addStringOption(option => 
        option.setName('category')
            .setDescription('reaction role category')
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
            ))
    .addStringOption((option => option.setName("rolename").setDescription('Name of the Role').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    
    async execute(interaction, client){

        var emote = interaction.options.getString('emote')
        var roleObj = interaction.options.getRole('roleid')
        var category = interaction.options.getString('category')
        var roleName = interaction.options.getString('rolename')


        const regexPattern = /<:\w+:\d+>/;

        // console.log(roleID)

        const emote2 = client.emojis.cache.find(emoji => emoji.toString() === emote )
        
        if(!emote2) return await interaction.reply({content: `This emote is not accessible in this server`})
        if(!roleObj) return await interaction.reply({content: `This role doesn't exist`})
                

        try{
            var res = await addRoleToDb(roleObj.id, emote, roleName, category );

            await interaction.reply({content: `Added ${roleName} role to DB with Reaction Role: ${emote} with category: ${category}` })

        }catch(e){
            console.error(e)
            await interaction.reply({content: `An error has occurred, please message the bot owner ${e}`})
        }

        

        // if(regexPattern.test(emote)){
        //     await interaction.reply({content: `Regex match, emote found `})
        // } else {
        //     await interaction.reply({content: `Regex did not match, emote found `})
        // }



    }
};
