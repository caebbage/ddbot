// check if message is on starboard
// if so, remove message from starboard
// then remove from data

module.exports = async (client, msg) => {
  try {
    if (msg.partial) msg = await msg.fetch()

    if (
      msg.inGuild()
      && ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(msg.channelId)
      && msg.reactions.resolve("⭐")?.count
    ) {
  
      if (react.partial) await react.fetch()

      let boardChannel = msg.channel.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel')
      boardChannel = client.channels.resolve(boardChannel);

      let boardMessage = (await boardChannel.messages.fetch({ limit: 100 })).find(post => {
        if (post.embeds && (post.embeds[0]?.footer?.text == msg.id || post.embeds[1]?.footer?.text == msg.id)) return true
          else return false
      })
  
      if (boardMessage) {
        boardMessage.delete().then(message => {
          console.log(`  [str] ${message.id} deleted (${msg.id} deleted)`)
        });
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}