const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getBalance, awardMoney, takeMoney } = require('../../database/dbService')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slotmachine')
    .setDescription('Play the virtual slot machine game')
    .addIntegerOption(option =>
      option.setName('bet')
        .setDescription('The amount to bet on the slot machine')
        .setRequired(true)
    ),

  async execute(interaction) {
    const symbols = ['🍒', '🍊', '🍇', '🍉', '🔔', '💰'];
    const payoutTable = {
      '🍒🍒🍒': 3,
      '🍊🍊🍊': 2,
      '🍇🍇🍇': 2,
      '🍉🍉🍉': 1,
      '🔔🔔🔔': 1,
      '💰💰💰': 1,
      '🍒🍊🍇': 1,
      '🍉🔔💰': 1,
      '💰💰🍊': 1,
      '🍇🍒🍊': 1,
    };

    const adjustedSymbols = [
      '🍒', '🍒', '🍒', '🍒', '🍒', // Increase the probability of '🍒' to make the game easier
      '🍊', '🍊', '🍊', '🍊',
      '🍇', '🍇', '🍇',
      '🍉', '🍉',
      '🔔',
      '💰',
    ];

    const bet = interaction.options.getInteger('bet');
    if (isNaN(bet) || bet <= 0) {
      return interaction.reply({ content: 'Please enter a valid bet amount!', ephemeral: true });
    }

    try {
      const balance = await getBalance(interaction.user.id);
      if (bet > balance) {
        return interaction.reply({ content: 'You don\'t have enough balance to place that bet!', ephemeral: true });
      }

      await takeMoney(interaction.user.id, bet);

      await interaction.deferReply();

      const rolls = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * adjustedSymbols.length);
        rolls.push(adjustedSymbols[randomIndex]);
      }

      const numberOfRolls = 10;
      const rollTime = 100;

      for (let i = 0; i < numberOfRolls; i++) {
        for (let j = 0; j < rolls.length; j++) {
          if (i === numberOfRolls - 1) {
            break;
          }
          if (i < numberOfRolls - j - 1) {
            rolls[j] = adjustedSymbols[Math.floor(Math.random() * adjustedSymbols.length)];
            const rollEmbed = new EmbedBuilder()
            .setTitle('Slot Machine')
            .setDescription(`You bet ${bet}. Combination: ${rolls.join(' ')}`)
            .setImage('https://static.wikia.nocookie.net/jujutsu-kaisen/images/8/80/Idle_Death_Gamble.png/revision/latest?cb=20220530005018')
            .setThumbnail('https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg');
          await interaction.editReply({ embeds: [rollEmbed] });
        }
        await new Promise(resolve => setTimeout(resolve, rollTime));
      }
    }

    const combination = rolls.join('');
    let payout = 0;
    if (combination in payoutTable) {
      payout = payoutTable[combination] * bet;
    }
    
    let color, description;
    
    if (payout > 0) {
      color = 0x00ff00;
      description = `You won ${payout}! Combination: ${combination}.`;
      await awardMoney(interaction.user.id, payout);
    } else {
      color = 0xff0000;
      description = `You lost ${bet}. Combination: ${combination}.`;
    }

    const finalEmbed = new EmbedBuilder()
      .setTitle('💸Slot Machine💸')
      .setDescription(description)
      .setColor(color)
      .setThumbnail('https://i.pinimg.com/564x/2b/b8/20/2bb820a8f9b6cd51f0d09d75cb65f6f7.jpg');
    
    await interaction.editReply({ embeds: [finalEmbed] });
  } catch(e) {
    await interaction.editReply({content: `An error has occurred, please message the bot developer with the error : ${e}`})
  }
},
};