const Discord = require("discord.js");
const config = require("./config.json");

const Roll = require('./modules/roll.js')
const Roster = require('./modules/roster.js')

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
  	const app = args.shift().toLowerCase();

  	if(app==='roster') {
  		const command = args.shift().toLowerCase();
  		if(command==='get')
  			Roster.get(msg);
  		if(command==='add')
  			Roster.add(msg);
  		if(command==='delete')
  			Roster.delete(msg);
  		if(command==='ding')
  			Roster.ding(msg);
  	}

  	if(app==='roll') {
  		msg.reply(Roll.roll(args))
  	}

  	if(app==='catjam') {
  		msg.channel.send('https://thumbs.gfycat.com/RingedBlandAfricanmolesnake-size_restricted.gif')
  		msg.delete();
  	}

  	if(app==='ping') {
  		const timeTaken = Date.now() - msg.createdTimestamp;
    	msg.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  	}
});