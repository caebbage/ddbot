exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  embed.description = ("### `PREFroll (dice syntax) [# comment]`\nalso `PREFd`\n> Rolls die based on the given dice syntax. If it works in Tupper, it'll work here.\n> \n> Comments are optional and separated by ` # `, but will allow you to include text in the embed.\n### `PREFchoose (one|two|three) [# comment]`\nalso `PREFch`\n> Chooses a result based on a list given, separated by `|`.\n> \n> Comments are optional and separated by ` # `, but will allow you to include text in the embed.\n### `PREFcoinflip [# comment]`\nalso `PREFcoin` or `PREFflip`\n> Flips a coin.\n> \n> Comments are optional and separated by ` # `, but will allow you to include text in the embed.\n### `PREFtext (format) (text to be formatted)`\nalso `PREFt`\n> Takes the text to be formatted and stylizes it with special characters.\n> \n> Accepted formats: `bold`, `smallcaps`, `superscript`, `typewriter`, `double`, `cursive`, `cursbold`, `gothic`, `gothbold`, `wide`\n### `PREFpool (name) [amount]`\n> Rolls a result out of the given command pool name, with an optional amount if the command allows it.\n> \n> *Hint:* Most of the times, you can also directly do `PREF(name) [amount]` instead.")
  .replace(/PREF/g, client.config.get('prefix'))

  message.reply(
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
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "help"
};