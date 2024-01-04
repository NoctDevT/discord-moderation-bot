const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getAllRolesFromDb, getUserRolesFromDb, addRoleToUser, removeRoleFromUser, addReactionRoleMessageID  } = require("../../database/dbService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gojoaddrr')
        .setDescription('Adds a reaction role!')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('category')
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
                    {name: 'Color', value: 'Color'}
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
        async execute(interaction, client) {
            const category = interaction.options.getString('category');
            const channelId = interaction.channelId;

          
            try {
              const dbRoles = await getAllRolesFromDb(category);
              const batchSize = 10; 
              const delayBetweenBatches = 5000; 

              let roleMessages = [];
              let reactionMaps = [];
          
              for (let i = 0; i < dbRoles.length; i += batchSize) {
                const rolesBatch = dbRoles.slice(i, i + batchSize);
                let roleMessage = 'React to get a role:\n';
                let reactionMap = new Map();
          
                for (const row of rolesBatch) {
                  const emoteID = row.emoteID.match(/\d+/)[0];
                //   const emote = client.emojis.cache.get(emoteID);
                const emote = client.emojis.resolve(emoteID);

                  if (emote) {
                    roleMessage += `${emote} for ${row.roleName}\n`;
                    reactionMap.set(emote.id, row.roleID);
                  } else {
                    console.log(`${emote} for ${row.roleName}`)
                  }
                }
          
                roleMessages.push(roleMessage);
                reactionMaps.push(reactionMap);
              }
          
              const sentMessages = [];
          
              for (let i = 0; i < roleMessages.length; i++) {
                const roleMessage = roleMessages[i];
                const reactionMap = reactionMaps[i];
          
                // Send the message and add reactions to it
                const sentMessage = await interaction.channel.send({ content: roleMessage });

                const messageId = sentMessage.id;
                await addReactionRoleMessageID(messageId, category, channelId)
                
                for (const emoteID of reactionMap.keys()) {
                  const emote = client.emojis.cache.get(emoteID);
                  if (emote) {
                    await sentMessage.react(emote);
                  }
                }
          
                sentMessages.push(sentMessage);
          
                if (i + 1 < roleMessages.length) {
                  await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
              }
          
              // Create collectors for the messages
              for (const sentMessage of sentMessages) {
                const filter = (reaction, user) => !user.bot;
                const collector = sentMessage.createReactionCollector({ filter, dispose: true });
                
                
          
                // Event: Reaction added
                collector.on('collect', async (reaction, user) => {
                  const { guild } = reaction.message;
                  const member = guild.members.cache.get(user.id);
                  const roleID = reactionMaps.find(reactionMap => reactionMap.has(reaction.emoji.id)).get(reaction.emoji.id);
          
                  if (roleID) {
                    const role = guild.roles.cache.get(roleID);
                    if (role && !member.roles.cache.has(roleID)) {
                      await member.roles.add(role);
                      await addRoleToUser(user.id, roleID)
                    }
                  }
                });

                // Event: Reaction removed
                collector.on('remove', async (reaction, user) => {
                  const { guild } = reaction.message;
                  const member = guild.members.cache.get(user.id);
                  const roleID = reactionMaps.find(reactionMap => reactionMap.has(reaction.emoji.id)).get(reaction.emoji.id);
          
                  if (roleID) {
                    const role = guild.roles.cache.get(roleID);
                    if (role && member.roles.cache.has(roleID)) {
                      await member.roles.remove(role);
                      await removeRoleFromUser(user.id, roleID);

                    }
                  }
                });



                
              }
            } catch (e) {
              console.error(e);
              await interaction.reply({ content: `An error has occurred whilst running this command, please let the bot developer or staff know.` });
            }
          }
        }