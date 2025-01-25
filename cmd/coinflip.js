exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  embed.title = `◆ Coinflip`
  if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

  let rng = Math.floor(Math.random() * 2);

  embed.description += `**${"<@" + message.author.id + ">"}**'s **Coinflip**`;
  embed.description += `\n— *result* ⟶ \` ${rng ? "Heads" : "Tails"} \``

  if (rng) {
    embed.thumbnail = { "url": client.config.get('success_img') }
  } else {
    embed.thumbnail = { "url": client.config.get('fail_img') }
  }

  if (message.guild) {
    let guildUser = await message.guild.members.fetch(message.author.id)

    embed.footer = {
      "text": guildUser.displayName || guildUser.username,
      "icon_url": guildUser.displayAvatarURL()
    }
  } else {
    embed.footer = {
      "text": message.author.displayName || message.author.username,
      "icon_url": message.author.displayAvatarURL()
    }
  }

  embed.timestamp = (new Date()).toISOString();

  message.reply(
    {
      embeds: [
        embed
      ]
    }
  )
  delete embed; return;
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ['coin', 'flip'],
  adminOnly: false
};

exports.help = {
  name: "coinflip"
};