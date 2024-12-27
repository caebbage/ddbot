// if reaction is star
// check if message is within designated category (to determine board)
// check if message is in logged list of starboard
// if so, access message & increment star count (edit database + post)
// if not, add to logged list and post in starboard

module.exports = async (client, react) => {
  try {
    if (react.partial) react = await react.fetch()
    
    if (react.message.inGuild()
      && ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(react.message.channelId)
      && react.emoji.toString() == "⭐" && react.count) {
      let content = await require('../mdl/starboard')(client, react.message);
  
      let boardChannel = react.message.channel.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel')
      boardChannel = client.channels.resolve(boardChannel);

      let boardMessage = (await boardChannel.messages.fetch({ limit: 100 })).find(post => {
        if (post.embeds && (post.embeds[0]?.footer?.text == react.message.id || post.embeds[1]?.footer?.text == react.message.id)) return true
        else return false
      })

      if (boardMessage) {
        boardMessage.edit(content).catch(err => console.log(err))
      } else {
        boardChannel.send(content).then((msg) => {
          console.log(`  [str] ${msg.id} created (${react.message.id} reacted to)`)
        }).catch(err => console.log(err))
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}