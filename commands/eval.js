exports.run = async (client,message,args)=>{
	try {
		if(message.flags.includes('d')) {
			message.delete();
			eval(args.join(' '));
			return;
		}
		if(message.flags.includes('s'))	{
			eval(args.join(' '));
			return;
		}
		var evaled = eval(args.join(' '))
        if(evaled instanceof Promise) {
        	evaled.then((value)=>{message.appendReply(value);},(e)=>{message.appendReply(e)});
        }
        else message.appendReply(evaled);
	}
	catch(e) {
        message.appendReply(e);
    }
}

exports.conf = {
	aliases:['node','exec']
}

exports.help = {
	name:"eval",
	desc:"Eval arbitraty javascript code in the environment of the selfbot",
	usage:"eval <>",
	extended:"",
	userOverwrite:'197319892238598144'
}
