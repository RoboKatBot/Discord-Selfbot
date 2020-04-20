const https = require('https');
const config = require('../config.json');



var a = https.request({
		host:"discordapp.com",
		path:config.DM,
		method:"POST",
		headers:{
			"Content-Type":"application/json"
		}
	}	
).end(JSON.stringify({
	content:'test'
}));

a.on('response', res=>{
	let chunk = '';
	res.on('data', data=>{chunk+=data});
	res.on('end', ()=>console.log(chunk));
	console.log('res: ', res)
})

setTimeout(()=>{},5000000)