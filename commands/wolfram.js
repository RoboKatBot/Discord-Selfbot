const {spawn} = require('child_process');
var proc;

exports.run = async (client,message,args)=>{
	if(!proc) {
		proc = spawn("Wolfram");
		proc.stdout.on('data',(data)=>{
			message.channel.send(`\`\`\`Mathematica\n${data}\`\`\``);
		});
	}
	proc.write(args.join(' ').trim()+'\n');
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:["mathematica", "math", "maths"]
}

exports.help = {
	name:"wolfram",
	desc:"open/use a wolfram repl session",
	usage:"wolfram [code]",
	extended:""
}
