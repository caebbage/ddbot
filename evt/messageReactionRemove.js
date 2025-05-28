module.exports = async (client, react, user) => {
  try {
    if (react.partial) react = await react.fetch()

    let reactRoles = client.db.reactroles.toObjects()

    // if in server
    if (react.message.inGuild()
      && ![client.config.get("starboard_channel"), client.config.get("starboard_nsfw_channel")].includes(react.message.channelId)
      && react.emoji.toString() == "⭐") {
      // check find message on one of starboards
      let { boardChannel, boardMessage, embed } = require('../mdl/starboard'),
        bMessage = await boardMessage(boardChannel(client, react.message), react.message);

      // if the message exists, edit or delete based on star count
      if (bMessage && react.emoji.toString() == "⭐" && react.count) {
        let content = await embed(client, react.message)
        bMessage.edit(content).catch(err => console.log(err))

      } else if (bMessage) {
        bMessage.delete().then(msg => {
          console.log(`  [star] ${msg.id} deleted (${react.message.id} react removed)`)
        })
      }
    } else if (reactRoles.map(x => x.message_id).includes(react.message.id)) {
      for (let row of reactRoles.filter(x => x.message_id == react.message.id)) {
        if (row.emoji == react.emoji.toString()) {
          let member = await react.message.guild.members.fetch(user.id);

          member.roles.remove(row.role_id);
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}