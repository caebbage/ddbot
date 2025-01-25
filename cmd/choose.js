exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  let choices = inputs.join(" ").split("|").map(x => x.trim()).filter(x => x);

  if (choices.length > 1) {
    embed.title = `◆ Choose`
    if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

    let rng = Math.random();

    embed.description += `**${"<@" + message.author.id + ">"}**'s `;

    embed.description += `**[ ${choices.join(" | ")} ]**`;
    embed.description += `\n— *result* ⟶ \` ${choices[Math.floor(rng * choices.length)]} \``

  } else embed.description = "Lack of input. Be sure to split your choices with `|`."

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
  aliases: ['ch'],
  adminOnly: false
};

exports.help = {
  name: "choose",
};