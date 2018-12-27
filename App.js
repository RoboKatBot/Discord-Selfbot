const Discord = require("discord.js");
const client = new Discord.Client();
const SweetieBot = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');


client.prefix = config.prefix;


const {inspect} = require('util');
Discord.Message.prototype.appendReply = function (reply) {
  if(typeof(reply)!=="string") {
    reply = inspect(reply);
  }
  if(reply.length + 15 + this.content.length >2000) {
    if (reply.length < 20000) {
      SweetieBot.users.get(client.user.id).send(reply,{split:true});
      reply = 'response exceeds 2000 chars';
    }
    else {reply = 'response exceeds 20000 chars';}
  }
  if(!client.parsed[this.id]) client.parsed[this.id]=[];
  client.parsed[this.id].push(client.hash(`${this.content}\n-------------\n${reply}`.trim()));
  this.edit(this.content + '\n-------------\n'+ reply).catch();
}

const crypto = require('crypto');
client.hash = (input)=>{
  var hash = crypto.createHash('sha256')
  hash.update(input);
  return hash.digest('hex');
}



client.commands = {}, //maybe implement Enmaps at some point
client.aliases = {};
client.parsed = {};
//client.db = require("./modules/PersistentDB.js");


fs.readdir('./commands/',(err,files)=>{
  if(err) console.log(err);
  files.filter(f=>f.endsWith('.js'));
  console.log(`Loading ${files.length} commands`);
  files.forEach(f=>{
    let cmd = require(`./commands/${f}`);
    client.commands[cmd.help.name]=cmd;
    if(cmd.init) cmd.init(client);
    cmd.conf.aliases.forEach(a=>{
      client.aliases[a]=cmd.help.name;
    });
  });
});


fs.readdir('./events/',(err,files)=>{
  if(err) console.log(err);
  files.filter(f=>f.endsWith('.js'));
  console.log(`Loading ${files.length} events`);
  files.forEach(f=>{
    const eventName = f.split(".")[0];
    const event = require(`./events/${f}`);
    client.on(eventName, event.bind(global, client));
    delete require.cache[require.resolve(`./events/${f}`)];
  });
});


client.on('error',e=>console.error(e.message));

client.login(config.token);
SweetieBot.login(config.SweetieBot);

// process.on('unhandledRejection',()=>{
//  console.log('Promise Unhandled Rejection:', arguments);
// })

// process.on('uncaughtException',e=>{
//   console.error('Uncaught Exception: ',e.message); // legit error handling
// });