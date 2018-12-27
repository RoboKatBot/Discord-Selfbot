exports.run = async (client,message,args)=>{
	if(!args[0]) {message.appendReply(client.user.presence);return;}
	var game = args.join(" ").trim();
	if(!game || game.length < 1||game==='null'||game==='none') game = null;
	client.user.setPresence({ game: { name: game, type: 0 } });
	message.delete().catch(console.error);
}


exports.conf = {
	aliases:["game"]
}

exports.help = {
	name:"playing",
	desc:"Set or view the current game",
	usage:"playing [GameName]",
	extended:""
}
