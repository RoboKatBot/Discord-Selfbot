exports.run = async (client, message, args) => {
  const [replyTo, ...replyText] = args;
  const replyToMsg = await message.channel.fetchMessage(replyTo); //client.channels.find(m=>await message.channel.fetchMessage(replyTo))
  message.channel.send(replyText.join(" "), {embed: {
    color: 3447003,
    author: {
      name: `${replyToMsg.author.username} (${replyToMsg.createdAt})`,
      icon_url: replyToMsg.author.avatarURL
    },
    description: replyToMsg.content
  }})
  .then(() => message.delete());
};

exports.conf = {
  aliases: [],
};

exports.help = {
  name: 'quote',
  description: 'Replies to a message by ID, by embedding the original below your response. Requires embed permissions!',
  usage: 'quote [message ID]'
};