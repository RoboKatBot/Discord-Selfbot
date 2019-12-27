exports.run = async (client,message,args)=>{
	if (!args[0]) {
		return message.appendReply(`Avaliable commands:\n${Object.keys(client.commands).join('\n')}`);
	}
	if (args[0] in client.commands) {
		let command = client.commands[args[0]];
		return message.appendReply(`${command.desc}\nUsage:\n${command.usage}`);
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
