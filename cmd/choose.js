exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  let user = "<@" + msg.author.id + ">";
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  let choices = inputs.join(" ").split("|").map(x => x.trim()).filter(x => x);

  if (choices.length > 1) {
    embed.title = `Choose`
    if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

    let rng = Math.random();

    embed.description += `**${user}**'s `;

    embed.description += `**[ ${choices.join(" | ")} ]**`;
    embed.description += `\n— *result* ⟶ \` ${choices[Math.floor(rng * choices.length)]} \``

  } else embed.description = "Lack of input. Be sure to split your choices with `|`."

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
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ['ch'],
  adminOnly: false
};

exports.help = {
  name: "choose",
};