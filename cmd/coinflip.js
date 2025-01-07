exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  let user = "<@" + msg.author.id + ">";
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  embed.title = `◆ Coinflip`
  if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

  let rng = Math.floor(Math.random() * 2);

  embed.description += `**${user}**'s **Coinflip**`;
  embed.description += `\n— *result* ⟶ \` ${rng ? "Heads" : "Tails"} \``

  if (rng) {
    embed.thumbnail = { "url": client.config.get('success_img') }
  } else {
    embed.thumbnail = { "url": client.config.get('fail_img') }
  }

  if (msg.guild) {
    let guildUser = await msg.guild.members.fetch(msg.author.id)

    embed.footer = {
      "text": guildUser.displayName || guildUser.username,
      "icon_url": guildUser.displayAvatarURL()
    }
  } else {
    embed.footer = {
      "text": msg.author.displayName || msg.author.username,
      "icon_url": msg.author.displayAvatarURL()
    }
  }

  embed.timestamp = (new Date()).toISOString();

  msg.reply(
    {
      embeds: [
        embed
      ]
    }
  )
  return;
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