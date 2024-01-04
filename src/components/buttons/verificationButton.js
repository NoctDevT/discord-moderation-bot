const { EmbedBuilder } = require("discord.js");
const { register } = require("../../database/dbService");
const getRandomImage = require("../../helperFunctions/randomWelcomeImages");
const {
  newAccRoleID,
  unverifiedRoleID,
  manualVerificationChannelID,
  welcomeChannel,
  rootRole,
} = require("../../config/STATEVALUES");

module.exports = {
  data: {
    name: `verificationBtn`,
  },
  async execute(interaction, client) {
    if (interaction.user.id === "363407177253388289") return null;
    if (interaction.user.id === "1110378630728663090") return null;

    const role = interaction.guild.roles.cache.get(rootRole);
    const unverifiedRole = interaction.guild.roles.cache.get(unverifiedRoleID);

    var registerObj = {
      discordID: interaction.user.id,
      punishmentLevel: 0,
      isBanned: 0,
    };

    register(registerObj)
      .then((res) => {
        console.log("registered");

        // interaction.reply({
        //   embeds: [embed],
        // });
      })
      .catch((err) => {
        console.log(err);

        // interaction.reply({
        //   embeds: [embed],
        // });
      });

    try {
      const guild = await interaction.guild.fetch();
      const roles = await guild.roles.fetch();
      const newAccRoleId = newAccRoleID;
      const newAccRole = roles.get(newAccRoleId);

      // const member = await guild.members.fetch(interaction.user.id);
      const createdTimestamp = interaction.user.createdAt.getTime();
      const currentTimeInMs = new Date().getTime();

      const timeSinceCreated = currentTimeInMs - createdTimestamp;

      const thirtyDaysInMilliseconds = 1000 * 60 * 60 * 24 * 30;

      console.log(" created timestamp time: " + timeSinceCreated);
      console.log(" tendays time: " + thirtyDaysInMilliseconds);

      if (timeSinceCreated < thirtyDaysInMilliseconds) {
        interaction.member.roles.add(newAccRole).then(async (member) => {
          // member.send(
          //   `As you have a new account a staff member will need to verify you.`
          // );

          await interaction.reply({
            content: `You will need to be verified manually by a member of staff as your account is new.`,
            ephemeral: true,
          });
        });

        var manualVerificationChannel = client.channels.cache.get(
          manualVerificationChannelID
        );

        return manualVerificationChannel.send({
          content: `${interaction.user} needs to be manually verified.`,
        });
      }

      var titleMsg = "A new member has appeared!";
      var welcomeMessage = `Welcome <@${interaction.member.user.id}>, be sure to create an <#988084904912908378> and be sure to set your <#992875621032149122>, enjoy your stay! (◕‿◕✿) `;
      var userGif = getRandomImage();

      const welcomeEmbed = new EmbedBuilder()
        .setTitle(titleMsg)
        .setDescription(welcomeMessage)
        .setImage(userGif)
        .setColor(client.color)
        .setTimestamp(Date.now())
        .setFooter({
          text: `Total Members: ${interaction.guild.memberCount}`,
          iconURL:
            "https://preview.redd.it/6y9n8y10the61.jpg?width=640&crop=smart&auto=webp&s=3fed13a299b02e58a8bf923d44bab8fdaa4aa2fd",
        })
        .setThumbnail(
          "https://i.scdn.co/image/ab67706c0000bebb17f1155a9c2081c0218a110e"
        );

      interaction.member.roles.add(role).then(async (member) => {
        try {
          await interaction.member.roles.remove(unverifiedRole);
          await interaction.reply({
            content: `You have been given ${role}`,
            ephemeral: true,
          });

          let openChannel = client.channels.cache.get(welcomeChannel);
          return await openChannel.send({ embeds: [welcomeEmbed] });
        } catch (e) {
          console.error(`an error has occurred with verificaton button ${e}`);
        }
      });

      // setTimeout(() => interaction.deleteReply(), 10000);
    } catch (e) {
      console.error(e);
    }

    // await interaction.reply
    // ({ content:  hasRole ? `You now have access to the server ${hasRole}` : `https://cdn.discordapp.com/guilds/988074773961641985/users/373247342457126914/avatars/c5f321e5744373475693391a886fd05d.png?size=256`})
  },
};
