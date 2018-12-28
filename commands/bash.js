const {exec} = require('child_process');

exports.run = async (client,message,args)=>{
	exec(`${args.join(' ').replace(/\|/,'\\|')}`,(error,stdout,stderr)=>{
		message.channel.send(`Output: ${error||stdout||stderr}`);
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
	desc:"e",
	usage:"bash command",
	extended:""
}

