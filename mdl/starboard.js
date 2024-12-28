module.exports = async (client, message) => {
  // starboard message builder

  let embeds = []

  async function addMessage(msg) {
    let author;
    try { author = await msg.guild.members.fetch(msg.author.id)
    } catch (err) {}
  
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
  
    embeds.push(embed);
  }

  if (message.reference?.messageId) { // if message is a reply to something
    let replied = message.channel.messages.resolve(message.reference.messageId);
    await addMessage(replied);
  }

  await addMessage(message);

  embeds = [...embeds, ...message.embeds] // adds embeds of message into embeds, if applicable
  
  if (embeds.length > 10) embeds.length = 10 // truncates amount of embeds in case

  return {
    content: `🌟 ${message.reactions.cache.get("⭐").count} → ${message.url}`,
    embeds: embeds
  }
}