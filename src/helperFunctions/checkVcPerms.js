
const fs = require('fs');

async function checkVoicePerms(userID, voiceChannelId) {
    return new Promise((resolve, reject) => {
      fs.readFile('src/events/guild/tempvcState.json', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const jsonData = JSON.parse(data);
        const owner = jsonData.tempvc.find(entry => entry.channeld === voiceChannelId);
        if (owner && owner.ownerId === userID) {
            resolve(true);
        } else {
            resolve(false);
        }
      });
    });
  }

  module.exports = checkVoicePerms;