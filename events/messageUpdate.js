exports.run = async (client,oldmessage,message)=>{
  if(message.author === client.user && message.content.startsWith(client.prefix) && client.parsed[message.id]&&!client.parsed[message.id].includes(client.hash(message.content))) {
    message.content = message.content.split('\n-------------\n')[0]
    client.emit('message',message);
    console.log('Reparseing a message')
  }
}