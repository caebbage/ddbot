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
      
      let { boardChannel, boardMessage, embed } = require('../mdl/starboard'),
        content = await embed(client, react.message),
        bChannel = boardChannel(client, react.message),
        bMessage = await boardMessage(bChannel, react.message);

      if (bMessage) {
        bMessage.edit(content).catch(err => console.log(err))
      } else {
        bChannel.send(content).then((msg) => {
          console.log(`  [star] ${msg.id} created (${react.message.id} reacted to)`)
        }).catch(err => console.log(err))
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}