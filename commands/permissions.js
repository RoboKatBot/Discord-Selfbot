const users = require('./owo.json');
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

	if (op == 'get') {
		message.appendReply(
			`Current permissions for ${user.username} are ${toList.format(users[user.id])}.`
		);
		return;
	}

	if (op == 'set') {
		let Δperms = [];
		let errors = [];
		args.forEach(command=>{
			if (!client.commands[commands] || command === 'ALL') {
				errors.push(command);
				return;
			}
			Δperms.push(command);
		});
		users[user.id] = Δperms;
		message.appendReply(
			`Set ${user.displayName} permissons to ${Δperms.length ? toList.format(Δperms) : 'none'}.
			${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
		)
		saveUsers();
	}

	if (op == 'remove') {
		let Δperms = [];
		let errors = [];
		args.forEach(command=>{
			if (!client.commands[commands] || command === 'ALL') {
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
			`Removed ${Δperms.length ? 'the ' + toList.format(Δperms) : 'no'} permissions for ${user.username}}.
			${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
		);
		saveUsers();
	}

	if (op == 'add') { //Default to 'add'
		let Δperms = [];
		let errors = [];
		args.forEach(command=>{
			if (!client.commands[commands] || command === 'ALL') {
				errors.push(command);
				return;
			}
			if (users[user.id].includes(command)) return;
				Δperms.push(command);
		});
		users[user.id] = users[user.id].concat(Δperms);
		message.appendReply(
			`Removed ${Δperms.length ? 'the ' + toList.format(Δperms) : 'no'} permissions for ${user.username}}.
			${errors.length ? 'Invalid commands: ' + toList.format(errors) : ''}`
		);
		message.appendReply(
			`Added ${Δperms.length ? 'the ' + toList.format(Δperms) : 'no'} permissions for ${user.username}}.
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
	desc:"Allows the specified user to use the command specified",
	usage:"permissions [add|set|remove|get] id ...commands",
	extended:"",
	userOverwrite:'197319892238598144'
}
