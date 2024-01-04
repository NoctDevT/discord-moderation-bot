const fs = require('fs');



async function getVoiceOwnerID(voiceChannelId) {
    return new Promise((resolve, reject) => {
      fs.readFile('src/events/guild/tempvcState.json', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const jsonData = JSON.parse(data);
        const owner = jsonData.tempvc.find(entry => entry.channeld === voiceChannelId);
        if (owner) {
          resolve(owner.ownerId);
        } else {
          resolve(null);
        }
      });
    })
}

    module.exports = getVoiceOwnerID;