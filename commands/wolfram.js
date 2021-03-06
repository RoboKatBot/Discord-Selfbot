const {spawn} = require('child_process');
const {watch} = require('chokidar');
var proc;

exports.run = async (client,message,args)=>{
	if(!proc) {
		proc = spawn("wolfram", ["-initfile", "~/.wolfram"]);
		proc.stdout.on('data',(data)=>{
			data = String(data).trim().replace(/In\[\d+\]\:=/,"").replace(`Wolfram Language 11.3.0 Engine for Linux ARM (32-bit)
Copyright 1988-2018 Wolfram Research, Inc.`,"");
			if (data) {
				if (a = data.match(/\x01(\/tmp\/out\d+\.(png|gif))/)) {
					console.log(`\n\nmatch: ${a[0]}\n\n`)
					message.channel.send(``,{files:[a[1]]});
					return;
				}
				data = data.match(/[\s\S]{1,1950}(?=\n|$)/g);
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
	desc:"Open/use a wolfram repl session",
	usage:"wolfram <code>",
	extended:"",
	userOverwrite:'197319892238598144'
}
