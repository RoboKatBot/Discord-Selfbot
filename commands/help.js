exports.run = async (client,message,args)=>{
	if (!args[0]) {
		return message.appendReply(`Avaliable commands:\n${Object.values(client.commands).map(k=>k.help.name+'\t'+k.help.desc).join('\n')}`);
	}
	if (args[0] in client.commands) {
		let command = client.commands[args[0]];
		return message.appendReply(`${command.help.extended||command.help.desc}\nUsage:\n${command.help.usage}`);
	}
	return message.appendReply(`Usage:\n${exports.help.usage}`);
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:["info"]
}

exports.help = {
	name:"help",
	desc:"Gives help for a command or a list of all commands",
	usage:"help [command]",
	extended:""
}
