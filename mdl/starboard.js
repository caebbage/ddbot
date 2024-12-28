module.exports = {
  boardChannel: (client, message) => {
    let channel = (message.channel.isThread() ?
      (message.channel.parent.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel')) :
      (message.channel.nsfw ? client.config.get('starboard_nsfw_channel') : client.config.get('starboard_channel'))
    )

    return client.channels.resolve(channel);
  },
  boardMessage: async (channel, message) => {
    return (await channel.messages.fetch({ limit: 100 })).find(post => {
      if (post.embeds && (post.embeds[0]?.footer?.text == message.id || post.embeds[1]?.footer?.text == message.id)) return true
      else return false
    })
  },
  embed: async (client, message) => {
    let embeds = []

    async function addMessage(msg, isMain) {
      let author;
      try {
        author = await msg.guild.members.fetch(msg.author.id)
      } catch (err) {}
      
      let embed = {
        "description": msg.content,
        "author": {
          "name": author?.displayName || msg.author.displayName,
          "icon_url": author?.displayAvatarURL() || msg.author.displayAvatarURL()
        },
        "timestamp": msg.editedTimestamp || msg.createdTimestamp
      }

      if (isMain) {
        embed.color = client.config.get('starboard_embed_color')
        embed.footer = {"text": msg.id}
      }

      // attaches image/video if first embedded file is one
      if (/(image|video)/.test(msg.attachments?.at(0)?.contentType)) {
        embed.image = {
          "url": msg.attachments.at(0).proxyURL
        }
      }

      embeds.push(embed);
    }

    if (message.reference?.messageId) { // if message is a reply to something
      let replied = message.channel.messages.resolve(message.reference.messageId);
      await addMessage(replied, false);
    }

    await addMessage(message, true);

    embeds = [...embeds, ...message.embeds] // adds embeds of message into embeds, if applicable

    if (embeds.length > 10) embeds.length = 10 // truncates amount of embeds in case

    return {
      content: `🌟 ${message.reactions.cache.get("⭐").count} → ${message.url}`,
      embeds: embeds
    }
  }
}