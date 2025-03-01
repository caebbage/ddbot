module.exports = async (client, msg) => {
  try {
    try {if (msg.partial) msg = msg.resolve()} catch (err) {} // resolves message if partial and able to

    if (
      msg.inGuild?.() &&
      msg.reactions?.resolve("⭐")?.count &&
      ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(msg.channelId)
    ) {
      let { boardChannel, boardMessage } = require('../mdl/starboard'),
        bMessage = await boardMessage(boardChannel(client, msg), msg);
  
      if (bMessage) {
        bMessage.delete().then(message => {
          console.log(`  [star] ${message.id} deleted (${msg.id} deleted)`)
        });
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}