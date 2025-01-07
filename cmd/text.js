exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  };

  let options = [`bold`, `smallcaps`, `superscript`, `typewriter`, `double`, `cursive`, `cursbold`, `gothic`, `gothbold`, `wide`]
  if (inputs.length) {
    if (options.includes(inputs[0].toLowerCase())) {
      let style = inputs.shift();
      if (inputs.join(" ").trim()) {
        embed.description = client.styleText(style, inputs.join(" ").trim());
      } else embed.description = "Please include text to be converted."
    } else embed.description = "Please specify a valid style."
    + `\nAcceptable styles are as follows: ${options.map(x => `\`${x}\``).join(" ")}.`
  } else embed.description = "Please provide an input in the format `" + (client.config.get("prefix") || 'dd!') + "text [styles] [text to format]`."
  + `\nAcceptable styles are as follows: ${options.map(x => `\`${x}\``).join(" ")}.`

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
  aliases: ['t'],
  adminOnly: false
};

exports.help = {
  name: "text"
};