const watched = require('./poll.json');
const fs = require('fs').promises;


exports.run = async (client,message,args)=>{
	if (message.channel.id!=='666245327224832008') return;
	let now = new Date();
	let then = new Date();
	let range = parseInt(args[0])||7;
	for (let i = 1; i <= range;i++) {
		then.setDate(now.getDate() + i);
		let dateString = then.toDateString();
		client.channels.get('666245327224832008').send(`> ${dateString}`)
			.then(async pollMessage=>{
				watched.push(pollMessage.id);
				await pollMessage.react('👍').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
				await pollMessage.react('👎').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
				await pollMessage.react('🤷').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
	
	}
	watched.forEach((messageID)=>{ //Purge messages older than 30 days old from watched list.
		client.channels.get('666245327224832008').fetchMessage(messageID).then(msg=>{
			if ((now.getTime()-msg.createdAt.getTime())/86400000 > 30) {
				watched.splice(watched.indexOf(messageID),1)//Index may have changed since forEach called, due to async nature.
			}
		})
	})
	fs.writeFile('./commands/watched.json',JSON.stringify(watched)).catch(console.error);
}

exports.init = (client)=>{
	client.on('messageReactionAdd', (reaction,user)=>{
		if (user.id!=='213592879480700928') return;
		if (watched.includes(reaction.message.id) && reaction._emoji.name==='👎')
			reaction.message.edit(`~~${reaction.message.content}~~`);
	});
	client.on('messageReactionRemove', (reaction,user)=>{
		if (user.id!=='213592879480700928') return;
		if (watched.includes(reaction.message.id) && reaction._emoji.name==='👎')
			reaction.message.edit(reaction.message.content.replace(/^~~|~~$/g,''));
	});
}

exports.conf = {
	aliases:['dnd','d&d','dates','availability','schedule']
}

exports.help = {
	name:"poll",
	desc:"Sends a list of dates to the <#666245327224832008> chat along with a reaction based voting system",
	usage:"poll [days]",
	extended:"",
	userOverwrite:"ALL"
}



