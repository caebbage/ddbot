const { styleText } = require("../mdl/format.js");

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  };

  if (inputs.length) {
    if (Object.keys(styleText.charSets).includes(inputs[0].toLowerCase())) {
      let style = inputs.shift();
      if (inputs.join(" ").trim()) {
        embed.description = styleText.format(style, inputs.join(" ").trim());
      } else embed.description = "Please include text to be converted."
    } else embed.description = "Please specify a valid style."
    + `\nAcceptable styles are as follows: ${Object.keys(styleText.charSets).map(x => `\`${x}\``).join(" ")}.`
  } else embed.description = "Please provide an input in the format `" + (client.config.get("prefix") || 'dd!') + "text [styles] [text to format]`."
  + `\nAcceptable styles are as follows: ${Object.keys(styleText.charSets).map(x => `\`${x}\``).join(" ")}.`

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
  aliases: ['t'],
  adminOnly: false
};

exports.help = {
  name: "text"
};