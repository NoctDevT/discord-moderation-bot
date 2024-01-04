module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
      const userId = '1051348479655563274'; // User ID to be checked and modified
      const roleIdToRemove = '988087797640474624'; // Role ID to be removed
      const roleIdToAdd = '988231370205700156'; // Role ID to be added
  
      if (message.author.id === userId) {
        const member = message.guild.members.cache.get(userId);
  
        if (member) {
          try {
            if (member.roles.cache.has(roleIdToRemove)) {
              await member.roles.remove(roleIdToRemove);
              await member.roles.add(roleIdToAdd);
              console.log(`Successfully modified roles for member with ID ${userId}`);
            } else {
              console.log(`Member with ID ${userId} does not have the role to remove.`);
            }
          } catch (error) {
            console.error(`Failed to modify roles for member with ID ${userId}: ${error}`);
          }
        } else {
          console.log(`Member with ID ${userId} not found in the server.`);
        }
      }
    }
  };