exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  embed.description = ("### `PREFroll (dice syntax) [# comment]`\n-# also `PREFd`\n> Rolls die based on the given dice syntax. Utilizes [Roll20's dice syntax](https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference).\n> -# Comments are optional and start with ` # `.\n\n### `PREFchoose (one|two|three) [# comment]`\n-# also `PREFch`\n> Chooses a result based on a list given, separated by `|`.\n> -# Comments are optional and start with ` # `.\n\n### `PREFcoinflip [# comment]`\n-# also `PREFcoin` or `PREFflip`\n> Flips a coin.\n> -# Comments are optional and start with ` # `.\n\n### `PREFtext (format) (text to be formatted)`\n-# also `PREFt`\n> Takes the text to be formatted and stylizes it with special characters.\n> Accepted formats: `bold`, `smallcaps`, `superscript`, `typewriter`, `double`, `cursive`, `cursbold`, `gothic`, `gothbold`, `wide`\n\n### `PREFchara [chara name|user]`\n-# also `PREFcharacter` or `PREFchar`\n> Fetches character information for yourself, or for a specified character or user.\n\n### `PREFinv [chara name|user]`\n-# also `PREFinventory`\n> Fetches inventory information for yourself, or for a specified character or user.\n> -# *Warning:* Might get long. Some of you guys have so much shit.\n\n### `PREFpool (name) [amount]`\n> Rolls a result out of the given command pool name, with an optional amount if the command allows it.\n> If you don't know what this command does, don't worry about it. :)\n> -# *Hint:* Most of the times, you can also directly do `PREF(name) [amount]` instead.\n\n### `PREFembed (json)`\n> Creates an embed using given JSON. try [this](https://embed.dan.onl/).")
  .replace(/PREF/g, client.config.get('prefix'))

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
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "help"
};