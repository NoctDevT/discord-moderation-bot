require("dotenv").config({path: "src/config/.env"});

// const { SpotifyPlugin } = require("@distube/spotify");
// const { SoundCloudPlugin } = require("@distube/soundcloud");
// const { DeezerPlugin } = require("@distube/deezer");
// const { YtDlpPlugin } = require("@distube/yt-dlp");
// const { DisTube } = require("distube");

// require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const { Configuration, OpenAIApi, OPEN_AI_ORG } = require("openai");


const { token, OPEN_AI_KEY} = process.env;
const { Client, Collection, GatewayIntentBits, Partials} = require("discord.js");
const fs = require("fs");

const {User, Message, GuildMember, ThreadMember, Channel, Reaction} = Partials;

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildVoiceStates, 
  ],
  partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction],

});

const configuration = new Configuration({
  organization: OPEN_AI_ORG,
  apiKey: OPEN_AI_KEY
});



const leaveOnStop = false;
const leaveOnFinish = false;

client.eventRegistered = false;
client.commands = new Collection();
client.commandArray = [];
client.color = "caa472";
client.buttons = new Collection()
client.lotteryActive = false;
client.lotteryJackpot = 0;
client.tfjs_toxicModel = undefined;
client.openAI = new OpenAIApi(configuration);

toxicity.load(0.95).then(m => {
  client.tfjs_toxicModel = m;

  console.log('Toxicity Model has been loaded')
})




//For pick and buttons


// client.player = new DisTube(client, {
//   leaveOnStop:  leaveOnStop,
//   leaveOnFinish: leaveOnFinish,
//   emitNewSongOnly: true,
//   emitAddSongWhenCreatingQueue: false,
//   emitAddListWhenCreatingQueue: false,
//   plugins: [
//     new SpotifyPlugin(),
//     new SoundCloudPlugin(),
//     new YtDlpPlugin(),
//     new DeezerPlugin()
//   ],
// });



const fncFolder = fs.readdirSync("./src/functions");

for (const folder of fncFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}


client.handleEvents();
client.handleCommands(); 
client.handleComponents();
client.login(token)