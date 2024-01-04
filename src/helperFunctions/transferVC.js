const fs = require('fs');

async function replaceOwner(newOwnerId, voiceChannelId) {
    return new Promise((resolve, reject) => {
      fs.readFile('src/events/guild/tempvcState.json', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
  
        const jsonData = JSON.parse(data);
        const index = jsonData.tempvc.findIndex(entry => entry.channeld === voiceChannelId);
        if (index === -1) {
          reject(new Error('Voice channel ID not found'));
          return;
        }
        jsonData.tempvc[index].ownerId = newOwnerId;
        fs.writeFile('src/events/guild/tempvcState.json', JSON.stringify(jsonData), err => {
          if (err) {
            reject(err);
            return;
          }
  
          resolve();
        });
      });
    });
  }

  module.exports = replaceOwner;