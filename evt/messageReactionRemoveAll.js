module.exports = async (client, msg, reacts) => {
  try {
    try {if (msg.partial) msg = msg.resolve()} catch (err) {} // resolves message if partial and able to
    
    if (
      msg.inGuild?.() &&
      reacts?.find(r => r.emoji.toString() == "⭐") &&
      ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(msg.channelId)
    ) {
      let boardChannel = (msg.channel.parent ?
        (msg.channel.parent.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel')) :
        (msg.channel.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel'))
      )

      boardChannel = client.channels.resolve(boardChannel);

      let boardMessage = (await boardChannel.messages.fetch({ limit: 100 })).find(post => {
        if (post.embeds && (post.embeds[0]?.footer?.text == msg.id || post.embeds[1]?.footer?.text == msg.id)) return true
          else return false
      })
  
      if (boardMessage) {
        boardMessage.delete().then(message => {
          console.log(`  [str] ${message.id} deleted (${msg.id} reacts removed)`)
        });
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}