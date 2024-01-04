const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addAllMembers } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addallmemberstodb")
    .setDescription("adds all members to db ")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {

    return await interaction.reply({content: 'This command is disabled and would need to be manually turned on by the bot developer.'})

    const guild = interaction.guild;
    
    // Fetch all members
    const members = await guild.members.fetch();

    await interaction.deferReply()

    try {
      for (const member of members.values()) {
        // Add member to the DB
        await addAllMembers(member.id);
      }
      await interaction.editReply({content: `Successfully added all members to the database.`})
    } catch (e) {
      console.error(e);
      return await interaction.editReply({content: `An error occurred: ${e}`})
    }
  },
};