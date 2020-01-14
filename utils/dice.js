// const https = require('https');
const config = require('../config.json');

exports.run = async (client,message)=>{
	const content =  message.content.slice(2);
	const atoms = content.replace('-','+-').split('+');
	atoms.map(atom=>{
		const dice = atom.match(/(\d*)d(\d+)/);
		const neg = (atom.match(/\-/g)||[]).length&1;
		if (dice) {
			diceInts = [parseInt(dice[1])||1,parseInt(dice[2])];
			return {value:roll(...diceInts),params:diceInts,neg};
		}
		else {
			const constant = parseInt(atom.match(/\d+/))
			return {value:constant,params:constant,neg};
		}
	});
	let dice = atoms.filter(atom=>atom.params.length==2)
	const response = [];
	response.push(atoms.map(atom=>{
		let ret = neg ? '- ' : '+ ' ;
		if (atom.value.length) 
			ret += `(${atom.value})`;
		else
			ret += atom.value;
	}).join('').slice(2));

	let total = 0;
	atoms.forEach(atom=>{
		if (atom.value.length) {
			total += atom.value.reduce((a,b)=>a+b,0)*atom.neg?-1:1;
		}
		else {
			total += atom.value*atom.neg?-1:1;
		}
	})
	response.push(total);
	if (dice.length==1&&dice[0].params[0]==1&&dice[0].params[1]==20) {
		if dice.roll==20 message.push('Critical Success!');
		if dice.roll==1 message.push('Critical Failure!');
	}
	exports.send(response.filter(Boolean).join('\n'));
};



exports.init = async (client) => {
	exports.send = (content) => {

		const webhook = client.guilds.get('666236320745652224').fetchWebhooks()
			.then(webhooks=>webhooks.filter(webhook=>webhook.channelID=='666257084941074442').first())

		webhook.then(webhook=>webhook.send(content,{
				avatarURL:'https://cdn.discordapp.com/attachments/349488875561025536/666277457564794900/unknown.png',
				username:'DiceGuy'
			}));
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





function roll(n,m) {
	return Array.from(
		Array(n),
		()=>Math.ceil(m*Math.random())
	);
}
