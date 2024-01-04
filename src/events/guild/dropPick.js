const {
  GuildMember,
  Embed,
  InteractionCollector,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const dropPick = require("../../helperFunctions/currencyEmbed");
const getRandomNumber = require("../../helperFunctions/getRandomNumber");
const { pickRoom } = require("../../config/STATEVALUES");

let messageCounter = 0;

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Create the cooldownChannels Set if it doesn't exist
    client.cooldownChannels = client.cooldownChannels || new Set();

    if (message.author.bot) return;

    // Check if the message is sent in the specific channel
    if (message.channel.id !== pickRoom) return;

    messageCounter++;
    const randomThreshold = getRandomNumber(160, 290);

    if (messageCounter >= randomThreshold) {
      if (client.cooldownChannels.has(pickRoom)) {
        return;
      }

      const randomEmbed = dropPick(client.color);

      try {
        const buttons = pickBtnBuilder(client);
        const channel = await client.channels.fetch(pickRoom);

        client.cooldownChannels.add(pickRoom);

        await channel
          .send({ embeds: [randomEmbed], components: [buttons] })
          .then((msg) => {
            setTimeout(() => msg.delete(), 20000);
          });

        setTimeout(() => {
          client.cooldownChannels.delete(pickRoom);
        }, 5000);
      } catch (error) {
        console.error("Failed to send message to specific channel:", error);
      }
      messageCounter = 0;
    }

    // if(message.author.id === '440524066181480458' )  message.react('👉')
    // if(message.author.id === '440524066181480458' )  message.react('👈')
    // if(message.author.id === '440524066181480458' )  message.react('😔')

    // if(message.author.id === '194470692257923074' )  message.react('🥶')
    // if(message.author.id === '194470692257923074' )  message.react('🍦')

    // if(message.author.id === '194470692257923074' )  message.react('🇮')
    // if(message.author.id === '194470692257923074' )  message.react('❤️')
    // if(message.author.id === '194470692257923074' )  message.react('🇯')
    // if(message.author.id === '194470692257923074' )  message.react('🇺')
    // if(message.author.id === '194470692257923074' )  message.react('🇳')

    // if(message.author.id === '585954906108592160' )  message.react('🇩')
    // if(message.author.id === '585954906108592160' )  message.react('🇳')

    // if(message.author.id === '259539471014428673' )  message.react('🇱')
    // if(message.author.id === '259539471014428673' )  message.react('💀')
    // if(message.author.id === '259539471014428673' )  message.react('💩')
    // if(message.author.id === '259539471014428673' )  message.react('👎')

    // if(message.author.id === '1050629310802837605'){
    //     message.send(',pick')
    // }

    // if(message.author.id === '119676495848407040'){

    //     if(!message.mentions.users.first()) {
    //         return;
    //     }
    //     const member = message.guild.members.cache.get(message.mentions.users.first().id)
    //     const femaleRole = '988139743248265216'

    //     if(member.roles.cache.has(femaleRole))
    //     message.reply(`Be careful of this man. he's known to ditch his guy friends for girls`)
    //         }

    // if (message.author.id === "307881779124240386") {
    //   if (message.content.includes("girl")) {
    //     message.reply("Bitchless");
    //   }
    // }

    //     if(message.author.id !== '1022601830066294935' ) {
    //         if(message.content.toLowerCase().includes('rizz')){
    //            message.reply("Shut the fuck up, you don't have rizz you never will, you are on Discord rizzing up girls and you should contemplate this sad life you're living rizzing up people who you will barely see in person. Go touch grass.")
    //         }
    //    }

    // if (message.author.id !== "1022601830066294935") {
    //   if (message.content.toLowerCase().includes("meow")) {
    //     message.reply("Bro? What the fuck is wrong with you...");
    //   }
    // }

    // if (message.channelId === "988082512251195413") {
    //   if (message.author.id === "727801704514584607") {
    //     message.reply("Delete this bro...");
    //   }
    // }

    // if(message.author.id === '119676495848407040'){
    //     message.react('💀')
    // }

    // message.react('🇮')
    // message.react('❤️')
    // message.react('🇯')
    // message.react('🇺')
    // message.react('🇳')

    // if(message.author.id === '837129960928968734') {
    //     message.react('🔥')
    //     message.react('💯')
    //     message.react('🐐')
    // }
  },
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickBtnBuilder(client) {
  // Clear the redeemedInteractions Set before sending a new set of buttons

  if (client.redeemedInteractions) {
    client.redeemedInteractions.clear();
  }

  const dummyButton = new ButtonBuilder()
    .setCustomId("dummyPickBtn")
    .setLabel("Pick!")
    .setStyle(ButtonStyle.Primary);

  const dummyButton2 = new ButtonBuilder()
    .setCustomId("dummyPickBtn2")
    .setLabel("Pick!")
    .setStyle(ButtonStyle.Primary);

  const dummyButton3 = new ButtonBuilder()
    .setCustomId("dummyPickBtn3")
    .setLabel("Pick!")
    .setStyle(ButtonStyle.Primary);

  const correctButton = new ButtonBuilder()
    .setCustomId("pickBtnCorrect")
    .setLabel("Pick!")
    .setStyle(ButtonStyle.Primary);

  // Create an array of buttons and shuffle it
  const buttons = [dummyButton, dummyButton2, dummyButton3, correctButton];
  const shuffledButtons = shuffle(buttons);

  // Add the shuffled buttons to the ActionRowBuilder
  const actionRow = new ActionRowBuilder().addComponents(shuffledButtons);
  return actionRow;
}
