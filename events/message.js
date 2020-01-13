const Cleverbot = require("cleverbot-node");
const clbot = new Cleverbot;
clbot.configure({botapi:"CC4rowc4_QDwLj2G_DrgjZcmWlQ"});
const https = require('https');
const config = require('../config.json');
const dice = require('./dice.js');



module.exports = async (client,message) => {
	if(message.channel.type === "dm" && message.author !== client.user && message.author.id !=='341534945304379392' && message.author.id!=='380224572231778304' && message.author.id!=='559186351635824651') {
		https.request({
				host:"discordapp.com",
				path:config.DM,
				method:"POST",
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
		).end(JSON.stringify({
			content:message.content,
			avatar_url:message.author.avatarURL,
			username:message.author.username
		}));


		//CleverBot response
		function CleverBotResponse(message) {
			clbot.write(message.content, (response) => {
				message.channel.startTyping();
				setTimeout(() => {
					var output = response.output;
					Math.random()*2|0&&(output = output.toLocaleLowerCase());
					Math.random()*2|0&&(output = output.split().reverse().join('').replace('.','').split().reverse().join(''));
			    	if (message.author.id === '194078738017681408') output = owo(output);
			    	message.channel.send(output).catch(console.error);
			    	message.channel.stopTyping();
			    	Math.random()*20|0||CleverBotResponse(message);
				}, (4+Math.random()*5) * 1000);
			});
		}

		CleverBotResponse(message);

	}

	if(message.author !== client.user) {
		if(/*[262139990748692480,341554494888476673,202051735416602625].includes(message.guild&&message.guild.id)||message.channel.type === */"dm") {
			if(message.content.match(/the\s+greater\s+good/i)) 
				message.channel.send("The Greater Good");
		}
	}

	//////////////////////Dice Bot /////////////////////////////////////

	if(message.channel.id === '666257084941074442' && message.content.match('^\\r')) {
		dice(client,message);
	}

	////////////////////////////////////////////////////////////////////

	if(message.author !== client.user || !message.content.startsWith(client.prefix)) return
    const args = message.content.slice(client.prefix.length).trim().split(' ');
  	const command = args.shift().toLowerCase();
  	const cmd = client.commands[command] || client.commands[client.aliases[command]];
	if (cmd) {
		message.flags = [];
		while(args[0] && (args[0][0] === "-" || args[0][0]=== "/")) {
			message.flags.push(args.shift().slice(1));
		}
		cmd.run(client, message, args).catch(e=>{console.log(e);});
	}/* else if(client.tags.has(command)) {
		message.edit(`${args.join(" ")} ${client.tags.get(command).contents}`);
	}*/
}


const cancer = ["owo", "OwO", "uwu", "UwU", ">w<", "^w^"];
const httpRegex = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;
const emojiRegex = /(:[a-zA-Z0-9_]+:)/gi;
const finalRegex = RegExp(httpRegex.source + '|' + emojiRegex.source,'gi');
function owo(msg,owo=false) {

	if (!msg.length) return ''; 

	msg = msg.split(finalRegex);

	msg = msg.map(m=>{
		if(!m || finalRegex.exec(m)) return m;
		m = m.split("r").join("w").split("R").join("W").split("l").join("w").split("L").join("W").split(" n").join(" ny").split(" N").join(" Ny").split("ove").join("uv").split("OVE").join("UV");
		return m;
	}).join('')

	if (owo) msg += " **" + cancer[cancer.length * Math.random() << 0] + '**';

	return msg;
}
