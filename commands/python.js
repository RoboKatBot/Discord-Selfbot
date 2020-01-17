const {exec} = require('child_process');

exports.run = async (client,message,args)=>{
	exec(`python << EOPYTHON\n${args.join(' ').trim()}\nEOPYTHON`,(error,stdout,stderr)=>{
		message.channel.send(`\`\`\`python\n${error||stdout||stderr}\`\`\``);
	})
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:[]
}

exports.help = {
	name:"python",
	desc:"Executes arbitrary code in python",
	usage:"python <code>",
	extended:"",
	userOverwrite:'197319892238598144'
}
