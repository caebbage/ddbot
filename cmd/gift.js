const { toObject } = require("../mdl/inventory.js");
const { arrayChunks } = require("../mdl/format.js")

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  }, components;

  try {
    let mentions = message.content.match(/(?<=<@!?)\d+(?=>)/g);
    if (mentions.length) {
      let taken = toObject(message.content);

      if (Object.keys(taken).length) {
        let user = message.author;
        let charas = await client.findChar(user.username || user.user.username);

        if (charas.length) {
          embed.description = "Select the character to gift from."

          components = arrayChunks(
            [... charas.map(x => {
              return {
                custom_id: "giftfrom:" + x.get("CHARACTER"),
                type: 2,
                style: 4,
                label: x.get("CHARACTER")
              }
            }), {
              custom_id: "cancel",
              type: 2,
              style: 2,
              label: "Cancel"
            }], 5).map((x) => {
              return {
                type: 1,
                components: x
              }
            })
        } else {
          embed.description = "Could not find characters for user!"
        }
      } else {
        embed.description = "Could not find anything to take!"
      }
    } else {
      embed.description = "No user specified to take items from!"
    }
  } catch (err) {
    console.log(err);
    embed.description = "An error occured. Check logs."
  }

  message.reply(
    {
      embeds: [
        embed
      ],
      components
    }
  )
};

exports.conf = {
  enabled: true,
  DM: false,
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "gift"
};