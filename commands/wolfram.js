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
				let a;
				if (a = data.match(/(Out\[\d+\]=) -Graphics-/)) {
					w = watch('/tmp/out.png').on('change',(path,details)=>{
						if (!details.size) {
							message.channel.send(`\`\`\`Mathematica\n${a[0]}\`\`\``,{files:["/tmp/out.png"]});
							w.close();
						}
					})
				}
				else {
					data = data.match(/[\s\S]{1,1950}(?=\n|$)/g);
					data.forEach(k=>message.channel.send(`\`\`\`Mathematica\n${k}\`\`\``));
				}
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
