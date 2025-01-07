exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars

  const { DiceRoll } = require('@dice-roller/rpg-dice-roller');
  let user = "<@" + msg.author.id + ">";
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  };


  if (inputs.length) {
    try {
      const roll = new DiceRoll(inputs.join(" "));

      embed.title = `Dice Roll`
      if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

      let result = {
        'roll': roll.output.slice(0, roll.output.indexOf(":")).trim(),
        'calc': roll.output.slice(roll.output.indexOf(":") + 1, roll.output.indexOf(" = ")).trim()
      }

      embed.description += `**${user}**'s `;

      result.calc = result.calc
        .replace(/(\d+)d/g, "~~$1~~") // #d = discarded
        .replace(/(\d+)\*/g, "&&$1&&") // #* = success
        .replace(/(&*\d+&*)\*\*/g, "**$1**") // #** = crit success
        .replace(/(\d+)__/g, "*$1*") // #__ = crit failure
        .replace(/&/g, "_") // replace & workaround
      embed.description += `**[${result.roll}]**: ${result.calc}`;
      embed.description += `\n— *result* ⟶ \` ${roll.total} \``

      if (roll.total > (roll.maxTotal + roll.minTotal) / 2) {
        embed.thumbnail = {
          "url": client.config.get('success_img')
        }
      } else {
        embed.thumbnail = {
          "url": client.config.get('fail_img')
        }
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

      delete roll, result;
    } catch (err) {
      embed.description = `Something went wrong: \`${err}\``;
    }
  } else {
    embed.description = "To roll, use the following command: `" + (client.config.get("prefix") || 'dd!') + "roll XdX # comment`\nAdvanced notation is supported. View [here](https://dice-roller.github.io/documentation/guide/notation/modifiers.html) for details."
  }

  msg.reply({
    embeds: [
      embed
    ]
  })
  delete embed; return;
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ["r"],
  adminOnly: false
};

exports.help = {
  name: "roll"
};