exports.run = async (client,message,args)=>{
	const number = parseInt(args.shift()||1);
	const filter = args[0] ? (regex = new RegExp(args.shift(),'i'),m=>regex.exec(q=message.guild.members.get(m.author.id),q&&q.displayName)||regex.exec(m.author.username)) : m=>m.author===client.user;
	message.delete().catch(console.error);
	message.channel.fetchMessages({limit: 100}).then(messages => {
		messages = messages.array();
		messages = messages.filter(filter);
		messages.length = number;
		messages.map(m=>m.delete().catch(console.error));
	});
}

exports.conf = {
	aliases:["del"]
}

exports.help = {
	name:"delete",
	desc:"Deletes the last n messages for the client or the users matching the regex",
	usage:"delete [number], [regex]",
	extended:"",
	userOverwrite:'197319892238598144'
}
