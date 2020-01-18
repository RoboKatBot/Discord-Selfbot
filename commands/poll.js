exports.run = async (client,message,args)=>{
	if (message.channel.id!==/*'666245327224832008'*/'349488875561025536') return;
	console.log(args);
	let now = new Date();
	let then = new Date();
	let range = parseInt(args[0])||7;
	for (let i = 1; i <= range;i++) {
		then.setDate(now.getDate() + i);
		let dateString = then.toDateString();
		client.channels.get('349488875561025536').send(`> ${dateString}`)
			.then(pollMessage=>{
				pollMessage.react('👍').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
				pollMessage.react('👎').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
				pollMessage.react('🤷').catch(e=>console.error(`Error in reacting to poll message: ${e}`));
				client.on('messageReactionAdd', (reaction,user)=>{
					if (user.id!==/*'213592879480700928'*/'197319892238598144') return;
					if (reaction._emoji.name==='👎')
						pollMessage.edit(`~~${pollMessage.content}~~`);
					
				});
				client.on('messageReactionRemove', (reaction,user)=>{
					if (user.id!==/*'213592879480700928'*/'197319892238598144') return;
					if (reaction._emoji.name==='👎')
						pollMessage.edit(pollMessage.content.replace(/^~~|~~$/g,''));
					
				});
			});
	}
}

exports.init = (client)=>{
	//optional
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
