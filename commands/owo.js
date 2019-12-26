const https = require('https');
const store = require('./owo.json');
const fs = require('fs');
const AndList = new Intl.ListFormat();


const Webhooks = {};
const channels = new Proxy(store, {
	get: function(obj, id) {
		if (!(('_' + id) in obj)) {
			obj['_' + id] = [];
		}
		return obj['_' + id];
	}
});

function addOWO(channelID,userIDs) {
	let ret = [];
	userIDs.forEach(user=>{
		if (!channels[channelID].includes(user)) {
			channels[channelID].push(user);
			ret.push(user);
		}
	});
	saveOWO();
	return ret;
}

function removeOWO(channelID,userIDs) {
	let ret = [];
	userIDs.forEach(user=>{
		var index = channels[channelID].lastIndexOf(user)
		if (index!==-1) {
			channels = channels.slice(0,index).concat(channels.slice(index+1))
			ret.push(user);
		}
	});
	save();
	return ret;
}



function setOWO(channelID,userIDs) {
	channels[channelID] = userIDs;
	save();
}

function saveOWO() {
	fs.writeFile('./owo.json',JSON.stringify(store),()=>{});
}

exports.run = async (client,message,args)=>{
	// if (message.guild.id!=='262139990748692480') return;

	let op;

	if (op = args[0].toLowerCase().match(/add|remove|get|set/)) {
		op = op[0];
		args.shift()
	}
	else {
		op = 'add'
	}

	if (op == 'get') {
		const channel = args[0] || message.channel;
		const users = channels[channel.id];
		message.appendReply(
			users.length
			? `Current OWO users for ${channel.name} ${users.length !== 1 ? 'are ' : 'is '} ${AndList(users)}.`
			: `There is currently no OWO users for ${channel.name}.`
		);
		return;
	}

	const channel = client.channels.get(args[1]) || message.channel;
	const regex = new RegExp(args[0],'i');
	const users = channel.guild.members.filter(u=>regex.exec(u.displayName)||regex.exec(u.user.username))
		.map(u=>u.id);

	if (!Webhooks[channel.id]) {
		if (await getWebhooks(client,webhooks=>{
			const webhook = webhooks.filter(webhook=>webhook.channelID===channel.id)[0]
			if (!webhook) {
				message.channel.send(`Can't access webhook for ${channel.name} (${channel.id}).\nCancelling operation.`)
				return 1;
			}
			Webhooks[channel.id] = webhook;
		}))
			return;
	}


	if (op == 'remove') {
		const Δusers = removeOWO(channel.id,users);
		message.appendReply(
			`Removed OWO for ${AndList(Δusers)}.`
		)
		return;
	}

	if (op == 'set') {
		setOWO(channel.id,users);
		message.appendReply(
			users.length
			? `Set OWO to ${AndList(users)}.`
			: `Set OWO to nobody.`
		)
		return;
	}

	if (op == 'add') { //Default to 'add'
		const Δusers = addOWO(channel.id,users);
		message.appendReply(
			`Added OWO for ${users.length ? AndList(Δusers) : 'nobody'}.`
		)
	}	
}

async function getWebhooks(client,cb) {
	const webhooks = client.guilds.map(guild=>
		guild.fetchWebhooks().catch(_=>0)
	);
	await Promise.all(webhooks)
	.then(webhooks=>webhooks.filter(k=>k)) // Remove any rejected fetches.
	.then(cb);
}

exports.init = async (client) =>{
	client.on('ready',()=>{

		getWebhooks(client,webhooks=>{
			Object.values(channels).forEach(channelID=>{
				const webhook = webhooks.filter(webhook=>webhook.channelID===channelID)[0]
				if (!webhook)
					return console.error(`Cannot access webhook for channel: ${channelID}`);
				Webhooks[channel.id] = webhook;
			});
		});


		/*const webhooks = [...client.guilds.map(k=>
			k.fetchWebhooks().catch(_=>0)
		)];

		Promise.all(webhooks).then(ws=>{
			

			client.channels.map(c=>{




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
		});*/
	});


	
	client.on("message",(m)=>{
		const channel = channels[m.channel.id];
		// if (m.author.bot) return;
		if (!channel || !channel.includes(m.author.id)) return;
		if (m.author===client.user && m.content.startsWith('||')) return;

		const user = m.channel.users.get(m.author.id);
		
		Webhooks[m.channel.id].send(owo(m.content,1),{
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
	usage:"owo [add|set|remove] RegExp [channelID]",
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
		m = m.split("r").join("w").split("R").join("W").split("l").join("w").split("L").join("W").split(" n").join(" ny").split(" N").join(" Ny").split("ove").join("uv").split("OVE").join("UV");
		return m;
	}).join('')


	if (owo) msg += " **" + cancer[cancer.length * Math.random() << 0] + '**';

	return msg;
}
