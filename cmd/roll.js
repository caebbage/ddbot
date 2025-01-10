const { DiceRoller, DiscordRollRenderer } = require("dice-roller-parser");
const roller = new DiceRoller();
const renderer = new DiscordRollRenderer();

exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  let user = "<@" + msg.author.id + ">";
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  };


  if (inputs.length) {
    try {
      let input = inputs.join(" ");

      let roll = roller.roll(input);

      try {
        let eval = renderer.render(roll)
          .replace(/^(.+) = (\d+)$/m, "$1") // trims result out of eval
          .replace(/\((.+?) = \d+\)/g, "[$1]") // replaces roll frames and removes =
        if (!eval.includes("]") && input.toLowerCase().includes("d"))
          eval = `[${eval}]` // adds frame if unframed + there is a roll in the input

        let min = (new DiceRoller(() => 0)).roll(input).value,
          max = (new DiceRoller(() => 1)).roll(input).value;

        embed.title = `◆ Dice Roll`
        if (comment) embed.description += `*${comment.split("\n").map(x => `> ${x}`).join("\n")}*\n`

        embed.description += `**${user}**'s `;

        embed.description += `**${input}**: ${eval}`;
        embed.description += `\n— *result* ⟶ \` ${roll.value} \``

        if (+roll.value >= (+min + +max) / 2) {
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

        delete input, roll, min, max;
      } catch (err) {
        console.log(err);
        embed.description = "Bad input. If in doubt, try standard dice format `1d100 + MOD`."
      }
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
  delete embed;
  return;
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