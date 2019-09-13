const {spawn} = require('child_process');
var proc;

exports.run = async (client,message,args)=>{
	if(!proc) {
		proc = spawn("wolfram");
		proc.stdout.on('data',(data)=>{
			data = String(data).trim().replace(/In\[\d+\]\:=/,"").replace(`Wolfram Language 11.3.0 Engine for Linux ARM (32-bit)
Copyright 1988-2018 Wolfram Research, Inc.`,"");
			if (data) {
				data = data.split(/\n.{0,1980}\n/g);
				data.forEach(k=>message.channel.send(`\`\`\`Mathematica\n${k}\`\`\``));
			}
		});
	}
	proc.stdin.write(args.join(' ').trim()+'\n');
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
