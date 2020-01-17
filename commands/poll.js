exports.run = async (client,message,args)=>{
	if (message.channel.id!==/*'666245327224832008'*/'349488875561025536') return;

	let then = new Date();
	for (let i = 1; i < args[0]||7;i++) {
		then.setDate(now.getDate() + i)
	}
	client.channels.get('349488875561025536').send(`> ${then.toDateString()}`).then(message=>{
		message.react('+1');
		message.react('-1');
		client.on('messageReactionAdd', (Reaction,user)=>{
			if (user.id==='213592879480700928') {
				message.edit(`~~${message.content}~~`);
			}
		})
	})
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
