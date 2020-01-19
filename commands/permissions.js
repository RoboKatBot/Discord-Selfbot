const users = require('../users.json');
const fs = require('fs').promises;
const toList = new Intl.ListFormat();

function saveUsers() {
	fs.writeFile('./users.json',JSON.stringify(users)).catch(console.error);
}

exports.run = async (client,message,args)=>{
	let op;

	if (op = args[0].toLowerCase().match(/add|remove|get|set/)) {
		op = op[0];
		args.shift()
	}
	else {
		op = 'add'
	}

	const user = client.users.get(args.shift());

	if (!users[user.id])
		users[user.id] = [];

	let Δperms = [];
	let errors = [];
	switch(op) {
		case 'get':
			message.appendReply(
				`Current permissions for ${user.username} are ${users[user.id].length?toList.format(users[user.id]):'None'}.`
			);
			break;
		case 'set':
			args.forEach(command=>{
				if (!client.commands[command] || command === 'ALL') {
					errors.push(command);
					return;
				}
				Δperms.push(command);
			});
			users[user.id] = Δperms;
			message.appendReply(
				`Set ${user.username} permissons to ${Δperms.length ? toList.format(Δperms) : 'none'}.
				${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
			)
			saveUsers();
			break;
		case 'remove':
			args.forEach(command=>{
				if (!client.commands[command] || command === 'ALL') {
					errors.push(command);
					return;
				}
				let userPerms = users[user.id]
				var index = userPerms.indexOf(command)
				if (index!==-1) {
					userPerms = userPerms.splice(index,1)
					Δperms.push(command);
				}
			});
			message.appendReply(
				`Removed ${Δperms.length ? 'the ' + toList.format(Δperms) : 'no'} permissions for ${user.username}.
				${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
			);
			saveUsers();
			break;
		default: //add
			args.forEach(command=>{
				if (!client.commands[command] || command === 'ALL') {
					errors.push(command);
					return;
				}
				if (users[user.id].includes(command)) return;
					Δperms.push(command);
			});
			users[user.id] = users[user.id].concat(Δperms);
			message.appendReply(
				`Added ${Δperms.length ? 'the ' + toList.format(Δperms) : 'no'} permissions for ${user.username}.
				${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
			)
			saveUsers();
	}
}

exports.init = (client)=>{
	//optional
}

exports.conf = {
	aliases:['perms']
}

exports.help = {
	name:"permissions",
	desc:"Allows the specified user to use the command specified (Most commands do not currently work for other users).",
	usage:"permissions [add|set|remove|get] id ...commands",
	extended:"",
	userOverwrite:'197319892238598144'
}
