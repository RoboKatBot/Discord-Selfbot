// const https = require('https');
const config = require('../config.json');

exports.run = async (client,message)=>{
	const content =  message.content.slice(2);
	let atoms = content.replace('-','+-').split('+');
	atoms = atoms.map(atom=>{
		const dice = atom.match(/(\d*)d(\d+)/);
		const neg = (atom.match(/\-/g)||[]).length&1;
		if (dice) {
			diceInts = [parseInt(dice[1])||1,parseInt(dice[2])];
			return {value:roll(...diceInts),params:diceInts,neg,type:'dice'};
		}
		else {
			const constant = parseInt(atom.match(/\d+/))
			return {value:constant,neg,type:'constant'};
		}
	});
	let dice = atoms.filter(atom=>atom.type==='type')
	const response = [];
	if (dice.some(die.params[0].length>1)) {
		response.push(atoms.map(atom=>{
			let ret = atom.neg ? ' - ' : ' + ';
			if (atom.value.length) 
				ret += '(' + atom.value.map(f=>f.keep?f.val:`~~${f.val}~~`) + ')';
			else
				ret += atom.value;
			return ret;
		}).join('').slice(3) + ' = ');
	}
	let total = 0;
	atoms.forEach(atom=>{
		let Δ;
		if (atom.type==='dice') {
			Δ = atom.value.reduce((a,b)=>a+b.keep?b.val:0,0);//sum all kept dice rolls
		}
		else {
			Δ = atom.value;
		}
		total += Δ*atom.neg?-1:1 //negate if needed
	})
	response.push(total);
	if (dice.length==1&&dice[0].value.filter(f=>f.keep).length===1&&dice[0].params[1]==20) { //if dice roll was a single kept d20 
		if (dice[0].value[0]==20) response.push(' Critical Success!');
		if (dice[0].value[0]==1 ) response.push(' Critical Failure!');
	}
	exports.send(response.join(''));
};



exports.init = async (client) => {
	exports.send = (content) => {
		if (message.channel.id==='666236320745652224') {
			const webhook = client.guilds.get('666236320745652224').fetchWebhooks()
				.then(webhooks=>webhooks.filter(webhook=>webhook.channelID=='666257084941074442').first())

			webhook.then(webhook=>webhook.send(content,{
					avatarURL:'https://cdn.discordapp.com/attachments/349488875561025536/666277457564794900/unknown.png',
					username:'DiceGuy'
				}));
		}
		else {
			message.channel.send(content);
		}
		/*https.request({
				host:"discordapp.com",
				path:config.DiceChannel,
				method:"POST",
				headers:{
					"Content-Type":"multipart/form-data"
				}
			}
		).end(JSON.stringify({
			content:content,
			avatar_url:'https://cdn.discordapp.com/attachments/349488875561025536/666277457564794900/unknown.png',
			username:'DiceGuy'
		}));*/

	}
}


function roll(n,m,k,lowest) { //returns array of {order,val,keep}
	let diceArray = [];
	for (var i = 0; i < n; i++) {
		diceArray[i] = {order:i,val:Math.ceil(m*Math.random()),keep:false};
	}
	diceArray.sort((f,g)=>g.val-f.val);
	if (k) diceArray.slice(...(lowest?[k]:[0,k])).forEach(f=>f.keep=true);
	diceArray.sort((f,g)=>g.order-f.order);
	return diceArray;
}