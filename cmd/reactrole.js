const { makeCharEmbed, arrayChunks } = require("../mdl/format.js");

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };
  
  let db = client.db;
  await db.reactroles.reload()

  if (message.member?.permissionsIn(message.channel).has("ADMINISTRATOR")) {
    try {
      if (inputs[0] === "add") {
        if (!inputs[1] || !/(?<=<@&)\d+(?=>)/.test(inputs[2])) return message.react("❌")
        await db.reactroles.sheet.addRow({
          message_id: message.reference.messageId,
          message_channel: message.channel.id,
          emoji: inputs[1],
          role_id: inputs[2].match(/(?<=<@&)\d+(?=>)/)[0]
        })

        await db.reactroles.reload()

        const target = await message.channel.messages.fetch(message.reference.messageId)
        await target.react(inputs[1])
        message.react("✅")
      } else if (inputs[0] === "remove") {
        if (!inputs[2]) return message.react("❌")

        let target = /https:\/\/discord\.com\/channels\/(?<guild>.+?)\/(?<channel>\d+)\/(?<message>\d+)/.exec(inputs[2])?.groups;
        if (!target) return message.react("❌")

        const reactMessage = await (await message.client.channels.fetch(target.channel)).messages.fetch(target.message)


        const userReactions = reactMessage.reactions.cache.filter(reaction => reaction.users.cache.has(message.client.user.id));
        if (inputs[1] == "all") {
          let reactions = db.reactroles.filter(row => row.get("message_id") == target.message),
            reacts = reactions.map(x => x.get("emoji"));

          for (let row of reactions) await row.delete()
          for (const reaction of userReactions.values()) await reaction.users.remove(message.client.user.id);
        } else {
          for (const reaction of userReactions.values()) {
            if (reaction.emoji.toString() == inputs[1]) {
              await db.reactroles.find(row => row.get("message_id") == target.message && row.get("emoji") == inputs[1]).delete()
              await reaction.users.remove(message.client.user.id);
            }
          }
        }
        await db.reactroles.reload()

        message.react("✅")
      }
    } catch (error) {
      console.log(error)
      message.react("❌")
    }
  }
};

exports.conf = {
  enabled: true,
  DM: false,
  aliases: [],
  adminOnly: true
};

exports.help = {
  name: "reactrole"
};