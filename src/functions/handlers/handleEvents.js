const fs = require("fs");
const ascii = require('ascii-table');

// module.exports = (client) => {
//   client.handleEvents = async () => {
//     const eventFolder = fs.readdirSync(`./src/events`);

//     for (const folder of eventFolder) {
//       const eventFiles = fs
//         .readdirSync(`./src/events/${folder}`)
//         .filter((file) => file.endsWith(".js"));

//       switch (folder) {
//         case "client":
//           for (const file of eventFiles) {
//             const event = require(`../../events/${folder}/${file}`);
//             if(event.once) client.once(event.name, (...args) => event.execute(...args, client));
//             else client.on(event.name, (...args) => event.execute(...args, client));
//           }
//           break;
//           case "guild": 
//             for(const file of eventFiles){
//               const guild = require(`../../events/${folder}/${file}`)
//               if(guild.once) client.once(guild.name, (...args) => guild.execute(...args, client));
//               else client.on(guild.name, (...args) => guild.execute(...args, client));
//             }
//         default:
//           break;
//       }
//     }
//   };
// };

module.exports = (client) => {
  client.handleEvents = async () => {
    const folders  = fs.readdirSync(`./src/events`);
    const table = new ascii().setHeading('Events', 'Status');

    for (const folder of folders) {
      const files = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith(".js"));

      for (const file of files) {
          const event = require(`../../events/${folder}/${file}`);

          if (event.rest) {
              if(event.once)
                  client.rest.once(event.name, (...args) =>
                  event.execute(...args, client)
              );
              else
                  client.rest.on(event.name, (...args) =>
                      event.execute(...args, client)
                  );
          } else {
              if (event.once)
                  client.once(event.name, (...args) => event.execute(...args, client));
              else {
                client.on(event.name, (...args) => event.execute(...args, client));

              }
          }
          table.addRow(file, "loaded");
          continue;
      }
    }
    return console.log(table.toString(), "\nLoaded events");
  };
}

