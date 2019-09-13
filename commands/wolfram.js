const {spawn} = require('child_process');
var proc;

exports.run = async (client,message,args)=>{
	if(!proc) {
		proc = spawn("wolfram");
		proc.stdout.on('data',(data)=>{
			data = String(data).replace(/\nIn\[\d+\]\:= /,"").replace(/\nWolfram Language [\d\.]+ Engine for Linux ARM (32-bit)\nCopyright 1988-\d+ Wolfram Research, Inc\./,"");
			console.log(data);
			data && message.channel.send(`\`\`\`Mathematica\n${data}\`\`\``);
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
