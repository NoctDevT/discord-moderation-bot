require("dotenv").config({ path: "../config/.env" });
const { DB_USER, DB_PASS, DB_URL, DB_NAME } = process.env;

const mysql = require("mysql");

// const connection = mySql.createConnection({
//   host: DB_URL,
//   user: DB_USER,
//   password: DB_PASS,
//   database: DB_NAME,
//   charset: 'utf8mb4'
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("Database Connection Failed !!!", err);
//   } else {
//     console.log("connected to Database");
//   }
// });


const pool = mysql.createPool({
  connectionLimit: 10,
  host: DB_URL,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  charset: 'utf8mb4'
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("Connected to Database");
  }
});

function connectDB() {}

module.exports = {
  register: function (userObj) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO Users (discordID, isBanned, punishmentLevel) VALUES (${userObj.discordID}, ${userObj.punishmentLevel}, ${userObj.isBanned})`,
        async function (err, result) {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return reject("is already registered.");
            }
          } else {
            return resolve("has been added to Database.");
          }
        }
      );
    });
  },

 addConfession: function (discordId, confession) {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO Confessions (discordId, confession) VALUES (?, ?)',
        [discordId, confession],
        function (err, result) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(`New confession added with ID ${result.insertId}`);
            resolve(result.insertId);
          }
        }
      );
    });
  },


 removeConfessionById : function (confessionId) {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM Confessions WHERE confessionID = ?',
        [confessionId],
        function (err, result) {
          if (err) {
            console.error(err);
            reject(err);
          } else if (result.affectedRows === 0) {
            console.error(`No confession found with ID ${confessionId}`);
            reject(`No confession found with ID ${confessionId}`);
          } else {
            console.log(`Confession with ID ${confessionId} removed.`);
            resolve();
          }
        }
      );
    });
  },

 getConfessionById: function(confessionId) {
    return new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM Confessions WHERE confessionID = ?',
        [confessionId],
        function (err, result) {
          if (err) {
            console.error(err);
            reject(err);
          } else if (result.length === 0) {
            console.error(`No confession found with ID ${confessionId}`);
            reject(`No confession found with ID ${confessionId}`);
          } else {
            console.log(`Confession with ID ${confessionId} retrieved.`);
            resolve(result[0]);
          }
        }
      );
    });
  },

  //   note has been set.

  // getBalance: function (discordID){
  //   return new Promise((resolve, reject) => {
  //     pool.query(
  //         async function (err, result){
  //           if(err) {
  //             reject(err)
  //           } else {
  //             resolve(JSON.parse(JSON.stringify(result)))
  //           }
  //         }
  //     )
  //   })
  // },

  getBalance: function (discordID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select currency from Users where discordID = '${discordID}'`,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            const balances = result.map((row) => row.currency);
            resolve(balances);
          }
        }
      );
    });
  },

  getTopBalances: function () {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT discordID, currency FROM Users ORDER BY currency DESC LIMIT 5`,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  
  checkIfDiscordIDExists: function (discordID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select count(*) as idCount from Users where discordID = '${discordID}'`,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            // If the count is greater than 0, the discordID exists in the table
            const exists = result[0].idCount > 0;
            resolve(exists);
          }
        }
      );
    });
  },

  sendMoney: function (discordID, recipientDiscordID, amount) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE Users 
        SET currency = CASE
            WHEN discordID = '${discordID}' THEN currency - ${amount}
            WHEN discordID = '${recipientDiscordID}' THEN currency + ${amount}
            ELSE currency
        END;`,
        function (err, result) {
          if (err) {
            console.log(err);
            reject(false);
          } else {
            console.log(result);
            resolve(true);
          }
        }
      );
    });
  },

  awardMoney: function (discordID, amount) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE Users
         SET currency = currency + ${amount}
         WHERE discordID = '${discordID}';`,
        function (err, result) {
          if (err) {
            console.log(err);
            reject(false);
          } else {
            console.log(result);
            resolve(true);
          }
        }
      );
    });
  },

  takeMoney: function (recipientDiscordID, amount) {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE Users
         SET currency = CASE
             WHEN discordID = '${recipientDiscordID}' THEN currency - ${amount}
             ELSE currency
         END;`,
        function (err, result) {
          console.log(`hello world`)
          if (err) {
            console.log(err);
            if (err.code) {
              return reject(false);
            }
          } else {
            console.log(result);
            return resolve(true);
          }
        }
      );
    });
  },


  addNote: function (notesObj) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO notes (discordID, note, note_author, date) VALUES (${notesObj.user.discordID}, '${notesObj.user.note}', '${notesObj.user.staffId}', '${notesObj.user.date}')`,
        async function (err, result) {
          if (err) {
            console.log(err);
            if (err.code) {
              return reject("error setting note");
            }
          } else {
            console.log(result.insertId);
            return resolve(["note has been set."]);
          }
        }
      );
    });
  },

  getPunishmentLevel: function (discordID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from Punishments where discordID = '${discordID}'`,
        async function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(JSON.stringify(result)));
          }
        }
      );
    });
  },

  getUser: function (discordID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from Users where discordID = '${discordID}'`,
        async function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(JSON.stringify(result)));
          }
        }
      );
    });
  },

  deleteNote: function (noteID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE from notes where noteID = '${noteID}' `,
        async function (err, result) {
          if (err) {
            reject(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  },

  getNote: function (discordID) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select * from notes where discordID = '${discordID}' ORDER BY noteID DESC`,
        async function (err, result) {
          if (err) {
            return reject("error retrieving data");
          } else {
            // console.log(result)
            return resolve(JSON.parse(JSON.stringify(result)));
          }
        }
      );
    });
  },


  addRoleToDb: function (roleID, emoteID, roleName, category) {
    return new Promise((resolve, reject) => {
      const insertStatement = `
      INSERT INTO roles (roleID, emoteID, roleName, category)
      VALUES ('${roleID}', '${emoteID}', '${roleName}', '${category}')
      ON DUPLICATE KEY UPDATE
        emoteID = '${emoteID}',
        roleName = '${roleName}',
        category = '${category}';
      `;
  
      pool.query(insertStatement, function (err, result) {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          console.log(result);
          resolve(true);
        }
      });
    });
  },

  deleteRoleFromDb: function (roleID) {
    return new Promise((resolve, reject) => {
      const deleteStatement = `
      DELETE FROM roles
      WHERE roleID = '${roleID}';
      `;
  
      pool.query(deleteStatement, function (err, result) {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          console.log(result);
          resolve(true);
        }
      });
    });
  },

  updateRoleInDb: function (roleID, emoteID, roleName, category) {
    return new Promise((resolve, reject) => {
      const updateStatement = `
      UPDATE roles
      SET emoteID = '${emoteID}', roleName = '${roleName}', category = '${category}',
      WHERE roleID = '${roleID}';
      `;

      pool.query(updateStatement, function (err, result) {
        if (err) {
          console.log(err);
          reject(false);
        } else {
          console.log(result);
          resolve(true);
        }
      });
    });
  },

  addRoleToUser: function (discordID, roleID) {
    return new Promise((resolve, reject) => {
      const insertStatement = `
      INSERT INTO UserRoles (discordID, roleID) VALUES (?, ?);
      `;
  
      pool.query(insertStatement, [discordID, roleID], function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  removeRoleFromUser: function (discordID, roleID) {
    return new Promise((resolve, reject) => {
      const deleteStatement = `
      DELETE FROM UserRoles WHERE discordID = ? AND roleID = ?;
      `;
  
      pool.query(deleteStatement, [discordID, roleID], function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAllRolesForUser: function (discordID) {
    return new Promise((resolve, reject) => {
      const selectStatement = `
      SELECT Roles.roleName
      FROM Users 
      JOIN UserRoles ON Users.discordID = UserRoles.discordID
      JOIN Roles ON UserRoles.roleID = Roles.roleID
      WHERE Users.discordID = ?;
      `;
  
      pool.query(selectStatement, [discordID], function (err, rows) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  
  getAllRolesFromDb: function (category) {
    return new Promise((resolve, reject) => {
      const selectStatement = `
      SELECT * FROM roles WHERE category = '${category}';
      `;
  
      pool.query(selectStatement, function (err, rows) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },


  /**
   * Used for 
   * @param {} channelId 
   * @param {*} category 
   * @returns 
   */

  addReactionRoleMessageID: function (messageID, category, channelID) {
    return new Promise((resolve, reject) => {
      const insertStatement = `
      INSERT INTO reaction_role_messages (messageID, category, channelid) VALUES (?, ?, ?);
      `;
  
      pool.query(insertStatement, [messageID, category, channelID], function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  deleteReactionRoleMessageID: function (category) {
    return new Promise((resolve, reject) => {
      const selectStatement = `
        SELECT messageID, channelID FROM reaction_role_messages WHERE category = ?
      `;
    
      pool.query(selectStatement, [category], function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const roleMessageObj = result.map(row => ({
            messageID: row.messageID,
            channelID: row.channelID
          })); // Extract messageIDs and channelIDs from the result
        
          const deleteStatement = `
            DELETE FROM reaction_role_messages WHERE category = ?
          `;
  
          pool.query(deleteStatement, [category], function (err, deleteResult) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(roleMessageObj); // Return the messageIDs and channelIDs
            }
          });
        }
      });
    });
  },

  /**
   * Used for when the application is starting up and maps all the 
   * reaction roles and sets the reaction roles up again 
   * @returns 
   */
  getReactionRoleMessageIDs: function () {
    return new Promise((resolve, reject) => {
      const selectStatement = `
      SELECT * FROM reaction_role_messages;
      `;
      pool.query(selectStatement, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },



/**
 * This is a function that should only be used when adding all the roles into the DB. 
 * Note this adds ALL the roles into the DB so it's advised manually delete the ones that are admin, donation or limited roles. 
 * @param {*} roleID 
 * @param {*} roleName 
 * @returns 
 */

addRole: function (roleID, roleName) {
  return new Promise((resolve, reject) => {
    const insertStatement = `
    INSERT INTO roles (roleID, roleName) VALUES (?, ?);
    `;

    pool.query(insertStatement, [roleID, roleName], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
},


/**
 * Only to be used with the addAllUsersToDb module !!
 * @param {*} memberID 
 * @returns 
 */
addAllMembers: function (memberID) {
  return new Promise((resolve, reject) => {
    const insertStatement = `
    INSERT IGNORE INTO Users (discordID, punishmentLevel, isBanned, currency, levelXP) 
    VALUES (?, 0, 0, 100, 0);
    `;

    pool.query(insertStatement, [memberID], function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
},

}


function updateUser(action) {
  if (action.TYPE === "punishment") punishmentRegister(action.USER);
  if (action.TYPE === "unban") unban(action.USER);
  if (action.TYPE === "addRole") updateRoles(action.USER, action.ROLE);
  if (action.TYPE === "setNote") updateRoles(action.USER, action.ROLE);
}

function retrieveUser(action) {
  if (action.TYPE === "punishment") retrievePunishment(action.USER);
  if (action.TYPE === "getRole") getRoles(action.USER);
  if (action.TYPE === "status") unban(action.USER);
  if (action.TYPE === "getNotes") unban(action.USER);
}

function punishmentRegister(user) {}
