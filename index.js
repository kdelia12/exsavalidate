const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const { EmbedBuilder } = require('discord.js');
const readlineSync = require('readline-sync');
const web3 = require("@solana/web3.js");
const { channel } = require('diagnostics_channel');

const HTTP_ENDPOINT = 'https://special-indulgent-glitter.solana-mainnet.discover.quiknode.pro/69bd625c3fae8d09c87a2a78b8ff325b76806837/'; // Replace with your Solana HTTP endpoint

async function fetchAndParseTransactionsol(txSignature) {
  const solana = new web3.Connection(HTTP_ENDPOINT);
  let finals = '';
  
  try {
    console.log(txSignature);
    await sleep(10000);
    const parsedTransaction = await solana.getTransaction(txSignature);
    sender = parsedTransaction.transaction.message.accountKeys[0];
    receiver = parsedTransaction.transaction.message.accountKeys[1];
    solscanlink = 'https://solscan.io/tx/' + txSignature;
    
    const unix_timestamp = parsedTransaction.blockTime;
    const date = new Date(unix_timestamp * 1000);
    const options = {
      timeZone: 'Asia/Bangkok', // GMT+7
      year: 'numeric',
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    
    const formattedTime = date.toLocaleString('en-US', options);
    // console.log(parsedTransaction.transaction.message.header)
    // console.log(parsedTransaction.meta.preTokenBalances)
    const amountusd = Math.abs(
        (parsedTransaction.meta.preTokenBalances[0]?.uiTokenAmount?.uiAmount ?? undefined) -
        (parsedTransaction.meta.postTokenBalances[0]?.uiTokenAmount?.uiAmount ?? undefined)
      ) ?? (() => { throw new Error('Failed to fetch the token amounts.'); })();
    const formattedusd = amountusd.toFixed(2)
    console.log(amountusd)
    // console.log(amountsol)
    const amountsol = parseFloat((Math.abs(parsedTransaction.meta.postBalances[0]/ 1000000000 - parsedTransaction.meta.preBalances[0]/ 1000000000)).toFixed(4));
    console.log(parsedTransaction.meta);
    if (isNaN(amountusd)){
        sender = parsedTransaction.transaction.message.accountKeys[0].toString();
        receiver = parsedTransaction.transaction.message.accountKeys[1].toString();
        embed = new EmbedBuilder()
        .setColor("#87FF52")
        .setTitle("Transaction Detected")
        .addFields(
          {name: "Amount :", value: amountsol + " SOL"},
          {name: "From :", value: sender},
          {name: "To :", value: receiver},
          {name: "wen :", value: formattedTime}
        )
        console.log("SOL");
        console.log(sender+" Sending "+amountsol+" SOL"+" to "+receiver+" at " +formattedTime)
        finals = sender+" Sending "+amountsol+" SOL"+" to "+receiver+" at " +formattedTime
      }
      else{
        token = parsedTransaction.transaction.message.accountKeys[4].toString();
        tokens = parsedTransaction.transaction.message.accountKeys[5].toString();
        if (token=== "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" || tokens=== "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" ){
            if ((parsedTransaction.meta.preTokenBalances[0].uiTokenAmount.uiAmount)-(parsedTransaction.meta.postTokenBalances[0].uiTokenAmount.uiAmount)===amountusd){
                sender = parsedTransaction.meta.preTokenBalances[0].owner;
                receiver = parsedTransaction.meta.preTokenBalances[1].owner;
            }
            else{
                sender = parsedTransaction.meta.preTokenBalances[1].owner;
                receiver = parsedTransaction.meta.preTokenBalances[0].owner;
            }
            
            embed = new EmbedBuilder()
            .setColor("#87FF52")
            .setTitle("Transaction Detected")
            .addFields(
              {name: "Amount :", value: formattedusd + " USDT"},
              {name: "From :", value: sender},
              {name: "To :", value: receiver},
              {name: "wen :", value: formattedTime}
            )
            console.log(sender+" Sending "+formattedusd+" USDT"+" to "+receiver+" at " +formattedTime)
            finals = sender+" Sending "+formattedusd+" USDT"+" to "+receiver+" at " +formattedTime
        }
        else if (token=== "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" || tokens === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"  ){
            if ((parsedTransaction.meta.preTokenBalances[0].uiTokenAmount.uiAmount)-(parsedTransaction.meta.postTokenBalances[0].uiTokenAmount.uiAmount)===amountusd){
                sender = parsedTransaction.meta.preTokenBalances[0].owner;
                receiver = parsedTransaction.meta.preTokenBalances[1].owner;
            }
            else{
                sender = parsedTransaction.meta.preTokenBalances[1].owner;
                receiver = parsedTransaction.meta.preTokenBalances[0].owner;
            }
            embed = new EmbedBuilder()
            .setColor("#87FF52")
            .setTitle("Transaction Detected")
            .addFields(
              {name: "Amount :", value: formattedusd + " USDC"},
              {name: "From :", value: sender},
              {name: "To :", value: receiver},
              {name: "wen :", value: formattedTime}
            )
            console.log(sender+" Sending "+formattedusd+" USDC"+" to "+receiver+" at " +formattedTime)
            finals = sender+" Sending "+formattedusd+" USDC"+" to "+receiver+" at " +formattedTime
        }
        else{
            console.log("unknown token");
            embed = new EmbedBuilder()
            .setColor("#87FF52")
            .setTitle("Unknown Token")
        }
        console.log("SOL");
      }
  } catch (error) {
    console.error('Failed to fetch and parse the SOL transaction:', error);
    finals = 'Failed to fetch and parse the SOL transaction: ' + error.message;
  }
  console.log(embed);
  return embed;
}

// Define the sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('messageCreate', async (message) => {
    // Check if the message contains a Solscan link
    const solscanRegex = /https:\/\/solscan\.io\/tx\/([^\s]+)/g;
    const matches = [...message.content.matchAll(solscanRegex)];
      if(channel=="1019185179442561034" || channel == "1162036320701513888" || channel == "1162036434224549898" || channel == "1119985055977189426" || channel == "1166109889614065856" || channel =="1131549535525683230"){
        return;
      }
      if (matches.length > 0) {
        const txHashes = matches.map(match => match[1]);
        for (const txHash of txHashes) {
            if (txHash) { // Check if txHash is not empty
              console.log('Received Solscan link:', txHash);
      
              try {
                let result = "";
                result = await fetchAndParseTransactionsol(txHash);
                console.log('Result:', result);
      
                // Ensure result is a string before replying
                if (result && typeof result === 'object') {
                    // Send the embed using the embeds property
                    message.reply({ embeds: [result] });
                  } else {
                    console.error('Invalid result format:', result);
                  }
              } catch (error) {
                console.error('Error processing Solscan link:', error);
                const errorMessage = 'Error processing Solscan link: ' + error.message;
      
                // Ensure errorMessage is a string before replying
                const content = errorMessage.toString();
                message.reply({ content });
              }
            }
          }
        }
      });
  
client.on("ready", () => {
    console.log("Systems Active!");
  });
// Replace 'YOUR_DISCORD_BOT_TOKEN' with your actual Discord bot token
client.login('');
