const http = require('http');

exports.run = async (client,message,args)=>{
	if(args[0]&&parseInt(args[0])===NaN) {
		message.appendReply("Invalid Arguments");
		return;
	}
		for(var promises = [];promises.length<(args[0]||1);) {
					promises.push(new Promise((resolve,reject)=>{
							http.get('http://api.thecatapi.com/v1/images/search?format=src&mime_types=image/gif', function(req) {
							if (req.statusCode!==302) reject();
							message.channel.send({files:[req.headers.location]})
								.then(resolve())
								.catch(e=>{console.log(e);reject()});
						});
				}));
		}
		Promise.all(promises).catch(()=>{
			message.appendReply("Service Unavailable")
		}).then((value)=>{
			message.delete();
		});
}

exports.conf = {
	aliases:[]
}

exports.help = {
	name:"cat",
	desc:"Sends n random cat gifs to the channel",
	usage:"cat [number]",
	extended:""
}
