const {
  SlashCommandBuilder,
  Intents,
} = require("discord.js");
// const mp3 = require(``)
const { join } = require('node:path');

const {

    generateDependencyReport,
        getVoiceConnection,
        AudioPlayerStatus,
        entersState,
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource,
        VoiceConnectionStatus,

} = require("@discordjs/voice");
// const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/opus');



const https = require("https");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gojovcradio")
    .setDescription("Radio for the vc"),

    
  //   async execute(interaction) {
  //     const voiceChannelId = interaction.member.voice.channelId;

  //     if (!voiceChannelId) {
  //       await interaction.reply(
  //         "You need to be in a voice channel to use this command."
  //       );
  //       return;
  //     }

  //     const audioStreamUrl = "https://ais-nzme.streamguys1.com/nz_011_aac";
  //     const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId);

  //     try {
  //       const voiceConnection = await joinVoiceChannel({
  //         channelId: voiceChannel.id,
  //         guildId: voiceChannel.guild.id,
  //         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  //       });

  //       const connection = getVoiceConnection(voiceChannel.guild.id);

  //       const stream = https.get(audioStreamUrl, response => {
  //         // Subscribe to the audio stream
  //         const subscription = connection.subscribe(response);

  //         // Handle errors when unsubscribing from the audio stream
  //         // subscription.unsubscribe().catch(console.error);
  //       });

  //       stream.on("error", error => {
  //         console.error("Error playing audio stream:", error);
  //         connection.destroy();
  //       });

  //       connection.on("disconnect", () => {
  //         console.log("Connection disconnected");
  //         stream.destroy();
  //       });

  //       console.log(`Joined voice channel ${voiceChannel.name}`);
  //       await interaction.reply("Audio stream played successfully.");
  //     } catch (error) {
  //       console.error("Error playing audio in voice channel:", error);
  //       await interaction.reply(
  //         "There was an error playing the audio stream. Please try again later."
  //       );
  //     }
  //   },

  async execute(interaction) {

    //   const voiceChannel = interaction.member.voice.channel;

    //       const voiceConnection = joinVoiceChannel({
    //         channelId: voiceChannel.id,
  
    //         guildId: interaction.guildId,
  
    //         adapterCreator: interaction.guild.voiceAdapterCreator,
    //       });

    //     const connection = getVoiceConnection(interaction.guildId);
    //     const player = createAudioPlayer();


    //     __dirname = `../../assets/`
    //     var resource = createAudioResource(join(__dirname, 'fujikaze.mp3'), { inlineVolume: true })
    //     resource.volume.setVolume(0.5);

    //     console.log({resource: player})

    //       try {
    //         await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
  
    //         console.log("Connected: " + voiceChannel.guild.name);
    //       } catch (error) {
    //         console.log("Voice Connection not ready within 5s.", error);
  
    //         return null;
    //       }
  
    //       connection.subscribe(player);
  
    //       player.play(resource);
  
    //       player.on("error", (error) => {
    //         console.error(`Error: ${error.message} with resource`);
    //       });
  },
};





// const {
//     generateDependencyReport,
//     getVoiceConnection,
//     AudioPlayerStatus,
//     entersState,
//     joinVoiceChannel,
//     createAudioPlayer,
//     createAudioResource,
//     VoiceConnectionStatus,
//   } = require("@discordjs/voice");
  
//   const { ChannelType } = require("discord.js");
  
//   module.exports = {
//     data: new SlashCommandBuilder()
  
//       .setName("join")
  
//       .setDescription("Joins a specified voice channel")
  
//       .addChannelOption((option) =>
//         option
  
//           .setName("channel")
  
//           .setDescription("Where")
  
//           .setRequired(true)
  
//           .addChannelTypes(ChannelType.GuildVoice)
//       ),
  
//     execute: async (interaction, client) => {
//       if (interaction.isChatInputCommand()) {
//         if (interaction.commandName === "join") {
//           interaction.reply({
//             content: "ok",
//           });
  
//           const voiceChannel = interaction.options.getChannel("channel");
  
//           const voiceConnection = joinVoiceChannel({
//             channelId: voiceChannel.id,
  
//             guildId: interaction.guildId,
  
//             adapterCreator: interaction.guild.voiceAdapterCreator,
//           });
  
//           const connection = getVoiceConnection(interaction.guildId);
  
//           const player = createAudioPlayer();
  
//           const resource = createAudioResource("G:\file.mp3");
  
//           try {
//             await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
  
//             console.log("Connected: " + voiceChannel.guild.name);
//           } catch (error) {
//             console.log("Voice Connection not ready within 5s.", error);
  
//             return null;
//           }
  
//           connection.subscribe(player);
  
//           player.play(resource);
  
//           player.on("error", (error) => {
//             // console.error(\Error: ${error.message} with resource);
//           });
//         }
//       }
//     },
//   };
  