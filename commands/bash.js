const {exec} = require('child_process');

exports.run = async (client,message,args)=>{
	exec(`echo ${args.join(' ').replace(/\|/,'\\|')} | bash`,(error,stdout,stderr)=>{
		message.channel.send(`Output: ${error||stdout||stderr}`);
	})
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:[]
}

exports.help = {
	name:"bash",
	desc:"e",
	usage:"bash command",
	extended:""
}
