var users = [];
var reason = '';
const AndList = new Intl.ListFormat();


exports.init = async (client)=>{
	client.on("message",(m)=>{
		// if (m.author.bot) return;
		if (!users.map(u=>u.user).includes(m.author)) return;
		m.delete();
	});
	client.on('voiceStateUpdate',(_,user)=>{
		if (!users.includes(user)) return;
		user.setMute(true,reason);
	});
}




exports.run = async (client,message,args)=>{
	const regex = new RegExp(args.shift()||'$a','i');
	reason=args.join(' ')||"why not?";

	const muted = [...message.guild.members.filter(u=>regex.exec(u.displayName)||regex.exec(u.user.username)).values()];
	console.log(`muted ${muted.length}`)
	console.log(muted);
	const unmuted = [];


	muted.forEach(u=>{
		u.setMute(true,reason);
		delete users[u];
	});
	users.forEach(u=>{
		u.setMute(false,'')
		unmuted.push(u.displayName);
	});

	users = muted;

	const reply = [
	muted.length ? `Muted ${AndList(muted.map(u=>u.displayName))} for ${reason}` : '',
	unmuted.length ? `Unmuted ${AndList(unmuted.map(u=>u.displayName))}` : ''
	].join('\n');


	message.appendReply(reply);

}


exports.conf = {
	aliases:["shutup","unmute"]
}

exports.help = {
	name:"mute",
	desc:"mutes or unmutes one or more users",
	usage:"mute RegExp [true/false] [Reason]",
	extended:""
}