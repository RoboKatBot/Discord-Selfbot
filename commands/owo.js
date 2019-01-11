const https = require('https');
const listToString = require('../utils/listToString');


const channels = {};

exports.run = async (client,message,args)=>{
	// if (message.guild.id!=='262139990748692480') return;
	const regex = new RegExp(args.shift(),'i');
	const channel = client.channels.get(args.shift()) || message.channel;

	channels[channel.id].users = channel.guild.members.filter(u=>regex.exec(u.displayName)||regex.exec(u.user.username));

	const reply = [
	channels[channel.id].users.size ? `OWOified ${listToString(channels[channel.id].users.map(u=>u.displayName))}.\n~Enjoy your blessing~.` : `Cleared OWOspeak`
	].join('/n')

	message.appendReply(reply);
}

exports.init = async (client) =>{
	client.on('ready',()=>{
		const webhooks = [...client.guilds.map(k=>
			k.fetchWebhooks().catch(_=>0)
		)];

		Promise.all(webhooks).then(ws=>{
			ws = ws.filter(k=>k);
			ws = ws.shift().concat(...ws);

			client.channels.map(c=>{
				c = c.id;
				const webhook = ws.filter(w=>w&&w.channelID===c).first();
				// if (!webhook) return console.error(`Cannot access webhook for channel: ${c}`);
				if (!channels[c])
					channels[c] = {webhook};
				else
					channels[c].webhook = webhook;
			})
		}).then(_=>{
			channels['262139990748692480'].users = client.channels.get('262139990748692480').guild.members.filter(u=>u.id==='194078738017681408');
			channels['262139990748692480'].users = client.channels.get('262139990748692480').guild.members.filter(u=>u.id==='194796042355605509');
			channels['341499589972459520'].users = client.channels.get('341499589972459520').guild.members.filter(u=>u.id==='264087705124601856');
		});
	});


	
	client.on("message",(m)=>{
		const channel = channels[m.channel.id];
		// if (m.author.bot) return;
		if (!channel || !channel.users || !channel.users.has(m.author.id)) return;
		if (m.author===client.user && m.content.startsWith('||')) return;

		const user = channel.users.get(m.author.id);
		
		channel.webhook.send(owo(m.content,1),{
			avatarURL:user.user.avatarURL,
			username:owo(user.displayName),
			files: [...m.attachments.values()].map(k=>k.url),
			embeds:m.embeds.map(k=>deep(k,[['author','name'],'description',['footer','text'],'title']))
		}).then(_=>m.delete()).catch(e=>console.error('Error sending message from webhook: ',e));

	})

}

function deep(obj,keys) {
	keys.forEach(key=>{
		k = typeof key === 'array' ? key.shift() : key;
		if (obj[k]) {
			if(typeof obj[k]==='object') deep(obj[k],k);
			else if (typeof obj[k]==='array') obj[k].forEach(q=>deep(q,k));
			else obj[k] = owo(obj[k]);
		}
	})
	return obj;
}




exports.conf = {
	aliases:[]
}

exports.help = {
	name:"owo",
	desc:"Turns all messages in channel for users to owo",
	usage:"owo RegExp [channelID]",
	extended:""
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
		m = m.split("r").join("w").split("R").join("W").split("l").join("w").split("L").join("W").split(" n").join(" ny").split(" N").join(" Ny").split("ove").join("uv").split("OVE").join("UV").replace(/\b(\w{3,}?)\b/,'th$1');
		return m;
	}).join('')


	if (owo) msg += " **" + cancer[cancer.length * Math.random() << 0] + '**';

	return msg;
}