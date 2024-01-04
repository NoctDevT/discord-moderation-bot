const {
    getReactionRoleMessageIDs,
    getAllRolesFromDb,
  } = require("../../database/dbService");
  const { roleChannel } = require("../../config/STATEVALUES");
  
  module.exports = {
    name: "ready",
    once: true,
    async execute(member, client) {
      const dbRes = await getReactionRoleMessageIDs();

      try {
        const messagesAndRoles = await Promise.all(
          dbRes.map(async (resObj) => {
            const channel =  client.channels.cache.get(resObj.channelid);
            const message = await channel.messages.fetch(resObj.messageID);
            const dbRoles = await getAllRolesFromDb(resObj.category);

            return { message, dbRoles, channel };
          })
        );
  
        messagesAndRoles.forEach(({ message, dbRoles }) => {
          // Construct the reaction map for this message
          const reactionMap = new Map();
          for (const row of dbRoles) {
            const emoteID = row.emoteID.match(/\d+/)[0];
            reactionMap.set(emoteID, row.roleID);
          }
  
          const collector = message.createReactionCollector({
            dispose: true,
          });
  
          collector.on("collect", async (reaction, user) => {
            const { guild } = reaction.message;
            const member = await guild.members.fetch(user.id);
  
            // Use the reaction map to get the role id
            const roleId = reactionMap.get(reaction.emoji.id);
  
            if (roleId) {
              const guildRole = guild.roles.cache.get(roleId);
              if (guildRole) {
                member.roles.add(guildRole).catch(console.error);
              }
            }
          });
  
          collector.on("remove", async (reaction, user) => {
            const { guild } = reaction.message;
            const member = guild.members.cache.get(user.id);
              const roleId = reactionMap.get(reaction.emoji.id);

            if (roleId) {
              const guildRole = guild.roles.cache.get(roleId);
              if (guildRole && member.roles.cache.has(roleId)) {
                member.roles.remove(guildRole);
              }
            }
          });
        });
      } catch (err) {
        console.error(err);
      }
    },
  };