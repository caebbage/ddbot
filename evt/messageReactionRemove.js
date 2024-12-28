module.exports = async (client, react) => {
  try {
    if (react.partial) react = await react.fetch()
    // if in server
    if (react.message.inGuild()
      && ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(react.message.channelId)) {
      // check find message on one of starboards
      let boardChannel = (react.message.channel.isThread() ?
        (react.message.channel.parent.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel')) :
        (react.message.channel.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel'))
      )
      boardChannel = client.channels.resolve(boardChannel);

      let boardMessage = (await boardChannel.messages.fetch({ limit: 100 })).find(post => {
        if (post.embeds && (post.embeds[0]?.footer?.text == react.message.id || post.embeds[1]?.footer?.text == react.message.id)) return true
          else return false
      })

      // if the message exists, edit or delete based on star count
      if (boardMessage && react.emoji.toString() == "⭐" && react.count) {

        let content = require('../mdl/starboard')(client, react.message);
        boardMessage.edit(content).catch(err => console.log(err))

      } else if (boardMessage){
        boardMessage.delete().then(msg => {
          console.log(`  [str] ${msg.id} deleted (${react.message.id} react removed)`)
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}