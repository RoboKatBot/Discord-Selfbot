// const https = require('https');
const config = require('../config.json');

exports.run = async (client,message)=>{
	const parsed = message.content.match(/^\\r\s*(\d*)d(\d+)/);
	const req = [parseInt(parsed[1])||1,parseInt(parsed[2])];
	const res = roll(...req);
	exports.send([
		req[0]!==1 ? res : '',
		res.reduce((a,b)=>a+b),
		req[0]==1 && req[1] == 20 ? 
			res[0] == 20 ? 'Critical Success!' :
			res[0] == 1  ? 'Critical Failure!' :
			'':''
		].filter(Boolean).join('    - '));
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
