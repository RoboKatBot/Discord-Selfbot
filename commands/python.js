exports.run = async (client,message,args)=>{
	exec(`python -c ${args.join(' ')}`,(error,stdout,stderr)=>{
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
	name:"python",
	desc:"Executes command in python",
	usage:"python <python code>",
	extended:""
}
