module.exports = async (client, msg) => {
  // starboard message builder

  let embeds = []

  if (msg.reference?.messageId) { // if message is a reply to something
    let replied = msg.channel.messages.resolve(msg.reference.messageId);
    
    let author = await replied.guild.members.fetch(replied.author.id)
    // create embed of that message
    let embed = {
      "description": replied.content,
      "author": {
        "name": "Replying to " + (author?.displayName || replied.author.displayName),
        "icon_url": author?.displayAvatarURL() || replied.author.displayAvatarURL()
      },
      "timestamp": replied.editedTimestamp || replied.createdTimestamp
    }

    // attaches image/video if first embedded file is one
    if (/(image|video)/.test(replied.attachments?.at(0)?.contentType)) {
      embed.image = {
        "url": replied.attachments.at(0).proxyURL
      }
    }

    embeds.push(embed) // adds to message
  }

  let author = await msg.guild.members.fetch(msg.author.id)

  let embed = {
    "description": msg.content,
    "color": client.config.get('starboard_embed_color'),
    "author": {
      "name": author?.displayName || msg.author.displayName,
      "icon_url": author?.displayAvatarURL() || msg.author.displayAvatarURL()
    },
    "footer": {
      "text": msg.id
    },
    "timestamp": msg.editedTimestamp || msg.createdTimestamp
  }

  // attaches image/video if first embedded file is one
  if (/(image|video)/.test(msg.attachments?.at(0)?.contentType)) {
    embed.image = {
      "url": msg.attachments.at(0).proxyURL
    }
  }

  embeds.push(embed); // adds message itself to embeds
  embeds = [...embeds, ...msg.embeds] // adds embeds of message into embeds, if applicable
  
  if (embeds.length > 10) embeds.length = 10 // truncates amount of embeds in case

  return {
    content: `🌟 ${msg.reactions.cache.get("⭐").count} → ${msg.url}`,
    embeds: embeds
  }
}