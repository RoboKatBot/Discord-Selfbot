// const https = require('https');
const config = require('../config.json');

exports.run = async (client,message)=>{
	const content =  message.content.slice(2);
	let atoms = content.replace('-','+-').split('+');
	atoms = atoms.map(atom=>{
		const dice = atom.match(/(\d{0,4})d(\d+)k?(l?)(\d*)(L?)/);
		const neg = (atom.match(/\-/g)||[]).length&1;
		if (dice) {
			params = {diceNo:+dice[1]||1, diceVal: +dice[2], keep: +dice[4], lowest: !!dice[3], lucky: !!dice[5]};
			if (message.author.id === client.user.id)
				params.lucky = true;
			return {value:roll(params), ...params, neg, type:'dice'};
		}
		else {
			const constant = parseInt(atom.match(/\d+/))
			return {value:constant,neg,type:'constant'};
		}
	});
	let dice = atoms.filter(atom=>atom.type==='dice')
	const response = [];
	if (dice.length>1 || (dice[0]&&dice[0].diceNo>1)) {
		response.push(atoms.map(atom=>{
			let ret = atom.neg ? '   -   ' : '   +   ';
			if (atom.value.length) 
				ret += '(' + atom.value.map(f=>f.keep?f.val:`~~${f.val}~~`) + ')';
			else
				ret += atom.value;
			return ret;
		}).join('').slice(7) + '   =   ');
	}
	let total = 0;
	atoms.forEach(atom=>{
		let Δ;
		if (atom.type==='dice') {
			Δ = atom.value.reduce((a,b)=>a+(b.keep?b.val:0),0);//sum all kept dice rolls
		}
		else {
			Δ = atom.value;
		}
		total += Δ*(atom.neg?-1:1) //negate if needed
	})
	response.push(total);
	if (dice.length==1&&dice[0].value.filter(f=>f.keep).length===1&&dice[0].diceVal==20) { //if dice roll was a single kept d20 
		let val = dice[0].value.filter(f=>f.keep)[0].val
		if (val===20) response.push('   Critical Success!');
		if (val===1 ) response.push('   Critical Failure!');
		if (val===1 && dice.diceNo>1 && !dice.lowest)
			return send(client,message,response.join(''), {username: 'No more Mr DiceGuy!'});
	}
	send(client,message,response.join(''));
};

function send(client, message, content, {username='DiceGuy'}={}) {
	if (message.channel.id=='666257084941074442') {
		const webhook = client.guilds.get('666236320745652224').fetchWebhooks()
			.then(webhooks=>webhooks.filter(webhook=>webhook.channelID=='666257084941074442').first())

		webhook.then(webhook=>webhook.send(content,{
				avatarURL:'https://cdn.discordapp.com/attachments/349488875561025536/666277457564794900/unknown.png',
				username
			}));
	}
	else {
		message.channel.send(content);
	}
}

exports.init = async (client) => {
}


function roll({diceNo, diceVal, keep, lowest, lucky}) { //returns array of {order,val,keep}
	let diceArray = [];
	for (var i = 0; i < diceNo; i++) {
		var val = die(diceVal);
		if (diceVal === 20 && lucky && val === 1)
			val = die(diceVal);
		diceArray[i] = {order:i, val, keep:true};
	}
	diceArray.sort((f,g)=>(g.val-f.val)*(lowest?-1:1));
	if (keep) diceArray.slice(keep).forEach(f=>f.keep=false);
	diceArray.sort((f,g)=>g.order-f.order);
	return diceArray;
}

function die(n) {
	return Math.ceil(n*Math.random());
}

class instance {
	constructor(message) {
		this.message = message;
		message.content = message.content.slice(2);

	}
	send() {

	}
}


function atomize() {
	let parse1 = content.replace('-','+-').replace('/','*/');
	atoms = atoms.map(atom=>{
		const dice = atom.match(/(\d{0,4})d(\d+)k?(l?)(\d*)(L?)/);
		const neg = (atom.match(/\-/g)||[]).length&1;
		if (dice) {
			params = {diceNo:+dice[1]||1, diceVal: +dice[2], keep: +dice[4], lowest: !!dice[3], lucky: !!dice[5]};
			if (message.author.id === client.user.id)
				params.lucky = true;
			return {value:roll(params), ...params, neg, type:'dice'};
		}
		else {
			const constant = parseInt(atom.match(/\d+/))
			return {value:constant,neg,type:'constant'};
		}
	});
}

function parse(content) {
	
}