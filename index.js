const Discord = require("discord.js");
const config = require("./config.json");

const Roll = require('./modules/roll.js')

const prefix = "!"

// Discord client setup
const client = new Discord.Client();
client.login(config.BOT_TOKEN);

client.on('message', msg => {
	// Dont react to bot msgs and normal msgs
	if (msg.author.bot) return;
	if (!msg.content.startsWith(prefix)) return;
	  	
	const commandBody = msg.content.slice(prefix.length);
  	const args = commandBody.split(' ');
  	const command = args.shift().toLowerCase();

  	if(command==='roll') {
  		msg.reply(Roll.roll(args))
  	}

  	if(command==='ping') {
  		const timeTaken = Date.now() - message.createdTimestamp;
    	message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  	}
});