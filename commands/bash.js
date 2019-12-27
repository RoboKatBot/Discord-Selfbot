const {exec} = require('child_process');

exports.run = async (client,message,args)=>{
	exec(`${args.join(' ')}`,(error,stdout,stderr)=>{
		message.channel.send(`\`\`\`Bash\n${error||stdout||stderr}\`\`\``);
	})
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:['pi']
}

exports.help = {
	name:"bash",
	desc:"Evaluate arbitrary shell code on the raspi",
	usage:"bash <code>",
	extended:""
}

