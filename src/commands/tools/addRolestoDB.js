const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { addRole } = require("../../database/dbService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrolestodb")
    .setDescription("adds all roles to db ")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {

    return await interaction.reply({content: 'This command is disabled and would need to be manually turned on by the bot developer.'})


    const guild = interaction.guild;
    const roles = guild.roles.cache;

    await interaction.deferReply()

    try {
      for (const role of roles.values()) {
        await addRole(role.id, role.name);
      }
      await interaction.reply({content: `Successfully added in all roles`})
    } catch (e) {
      console.error(e);
      return await interaction.reply({content: `${e}`})
    }
  },
};
