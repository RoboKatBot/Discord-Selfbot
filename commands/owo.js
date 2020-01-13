const https = require('https');
const store = require('./owo.json');
const fs = require('fs').promises;
const toList = new Intl.ListFormat();


const Webhooks = {};

function addOWO(channelID,userIDs) {
	let ret = [];
	userIDs.forEach(user=>{
		if (!store[channelID].includes(user)) {
			store[channelID].push(user);
			ret.push(user);
		}
	});
	saveOWO();
	return ret;
}

function removeOWO(channelID,userIDs) {
	let ret = [];
	userIDs.forEach(user=>{
		let c = store[channelID]
		var index = c.lastIndexOf(user)
		if (index!==-1) {
			c = c.slice(0,index).concat(c.slice(index+1))
			ret.push(user);
		}
	});
	saveOWO();
	return ret;
}



function setOWO(channelID,userIDs) {
	store[channelID] = userIDs;
	saveOWO();
}

function saveOWO() {
	fs.writeFile('./commands/owo.json',JSON.stringify(store))/*.catch(console.error)*/;
}

function getNames(client,userIDS) {
	return client.users.filter(u=>
		userIDS.includes(u.id)
	).map(u=>u.username);
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
		const channel = client.channels.get(args[0]) || message.channel;
		const users = store[channel.id] || [];
		message.appendReply(
			users.length
			? `Current OWO users for ${channel.name} ${users.length !== 1 ? 'are' : 'is'} ${toList.format(getNames(client,users))}.`
			: `There is currently no OWO users for ${channel.name}.`
		);
		return;
	}

	const channel = client.channels.get(args[1]) || message.channel;
	const regex = new RegExp(args[0],'i');
	const users = channel.guild.members.filter(u=>regex.exec(u.displayName)||regex.exec(u.user.username))
		.map(u=>u.id);

	if (!store[channel.id])
		store[channel.id] = [];

	if (!Webhooks[channel.id]) {
		if (await getWebhooks(client,webhooks=>{
			const webhook = webhooks.filter(webhook=>webhook.channelID===channel.id).first();
			if (!webhook) {
				message.channel.send(`Can't access webhook for ${channel.name} (${channel.id}).\nCancelling operation.`);
				return 1;
			}
			Webhooks[channel.id] = webhook;
		}))
			return;
	}

	if (!channel.members.get(client.user.id).hasPermission("MANAGE_MESSAGES")) {
		message.channel.send(`Warning, can not delete messages in ${channel.name} (${channel.id}). This will lead to duplicate messages.`)
	}


	if (op == 'remove') {
		const Δusers = removeOWO(channel.id,users);
		message.appendReply(
			`Removed OWO for ${toList.format(getNames(client,Δusers))}.`
		)
		return;
	}

	if (op == 'set') {
		setOWO(channel.id,users);
		message.appendReply(
			users.length
			? `Set OWO to ${toList.format(getNames(client,users))}.`
			: `Set OWO to nobody.`
		)
		return;
	}

	if (op == 'add') { //Default to 'add'
		const Δusers = addOWO(channel.id,users);
		message.appendReply(
			`Added OWO for ${Δusers.length ? toList.format(getNames(client,Δusers)) : 'nobody'}.`
		)
	}	
}

async function getWebhooks(client,cb) {
	const webhooks = client.guilds.map(guild=>
		guild.fetchWebhooks().catch(_=>0)
	);
	await Promise.all(webhooks)
		.then(webhooks=>webhooks.filter(k=>k) // Remove any rejected fetches.
			.reduce((a,b)=>a.concat(b)) //Flatten all webhooks into a collection
		).then(cb);
}

exports.init = async (client) =>{
	client.on('ready',()=>{

		getWebhooks(client,webhooks=>{
			Object.keys(store).forEach(channelID=>{
				const webhook = webhooks.filter(webhook=>webhook.channelID==channelID).first()
				if (!webhook)
					return console.error(`Cannot access webhook for channel: ${channelID}`);
				Webhooks[channelID] = webhook;
			});
		});


		/*const webhooks = [...client.guilds.map(k=>
			k.fetchWebhooks().catch(_=>0)
		)];

		Promise.all(webhooks).then(ws=>{
			

			client.store.map(c=>{




			ws = ws.filter(k=>k);
			ws = ws.shift().concat(...ws);

			client.store.map(c=>{
				c = c.id;
				const webhook = ws.filter(w=>w&&w.channelID===c).first();
				// if (!webhook) return console.error(`Cannot access webhook for channel: ${c}`);
				if (!store[c])
					store[c] = {webhook};
				else
					store[c].webhook = webhook;
			})
		});*/
	});


	
	client.on("message",(m)=>{
		const channel = store[m.channel.id];
		// if (m.author.bot) return;
		if (!channel || !channel.includes(m.author.id)) return;
		if (m.author===client.user && m.content.startsWith('||')) return;

		const user = m.channel.members.get(m.author.id);
		
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
	usage:"owo [add|set|remove|get] RegExp [channelID]",
	extended:""
}










const cancer = ["owo", "OwO", "uwu", "UwU", ">w<", "^w^", "◕w◕", "◔w◔", "☆w☆", "ØwØ", "σωσ", "ᅌ ω ᅌ", "(⁄ʘ⁄ ⁄ ω⁄ ⁄ ʘ⁄)♡", "♥w♥", "ᎧᏇᎧ"];
const httpRegex = /(https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;
const emojiRegex = /(:[a-zA-Z0-9_]+:)/gi;
const finalRegex = RegExp(httpRegex.source + '|' + emojiRegex.source,'gi');
function owo(msg,owo=false) {

	if (!msg.length) return ''; 

	msg = msg.split(finalRegex);

	msg = msg.map(m=>{
		if(!m || finalRegex.exec(m)) return m;
		m = m.replace('MonoclyMan','MonOwOcwyMan');
		m = m.split("r").join("w").split("R").join("W").split("l").join("w").split("L").join("W").split(" n").join(" ny").split(" N").join(" Ny").split("ove").join("uv").split("OVE").join("UV");
		return m;
	}).join('')


	if (owo) msg += " **" + cancer[cancer.length * Math.random() << 0] + '**';

	return msg;
}
