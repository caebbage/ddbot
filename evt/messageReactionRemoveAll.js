module.exports = async (client, msg, reacts) => {
  try {
    try {if (msg.partial) msg = msg.resolve()} catch (err) {} // resolves message if partial and able to
    
    if (
      msg.inGuild?.() &&
      reacts?.find(r => r.emoji.toString() == "⭐") &&
      ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(msg.channelId)
    ) {
      let { boardChannel, boardMessage } = require('../mdl/starboard'),
        bMessage = await boardMessage(boardChannel(client, msg));
  
      if (bMessage) {
        bMessage.delete().then(message => {
          console.log(`  [str] ${message.id} deleted (${msg.id} reacts removed)`)
        });
      }
      return
    }
  } catch (err) {
    console.log(err)
  }
}