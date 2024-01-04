const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

const { newAccRoleID, unverifiedRoleID, verficationRole } = require("../../config/STATEVALUES");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")

    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to verify")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription("verify a user into the server"),
  async execute(interaction, client) {

    var member = interaction.options.getUser('target');

    const roleIdsToRemove = [newAccRoleID, unverifiedRoleID];

    roleIdsToRemove.forEach((roleId) => {
      if (member.roles.cache.has(roleId)) {
        member.roles
          .remove(roleId)
          .then(() => {
            console.log(`Role ${roleId} removed successfully`);
          })
          .catch((error) => {
            console.error(`Error removing role ${roleId}:`, error);
          });
      } else {
        console.log(`User does not have the role ${roleId}`);
      }
    });


    interaction.member.roles.add(verficationRole)

    interaction.reply({content: `Verified`})


  },
};
