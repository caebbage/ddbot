module.exports = async (client, react) => {
  try {
    if (react.partial) react = await react.fetch()
    // if in server
    if (react.message.inGuild()
      && ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(react.message.channelId)) {
      // check find message on one of starboards
      let { boardChannel, boardMessage, embed } = require('../mdl/starboard'),
        content = await embed(client, react.message),
        bMessage = await boardMessage(boardChannel(client, react.message));

      // if the message exists, edit or delete based on star count
      if (bMessage && react.emoji.toString() == "⭐" && react.count) {
        bMessage.edit(content).catch(err => console.log(err))

      } else if (bMessage){
        bMessage.delete().then(msg => {
          console.log(`  [str] ${msg.id} deleted (${react.message.id} react removed)`)
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}