const { fromEmbeds, toObject } = require("../mdl/inventory.js");
const { arrayChunks } = require("../mdl/format.js")

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get('embed_color')
  }, components;

  try {
    let mentions = message.content.match(/(?<=<@!?)\d+(?=>)/g);
    if (mentions.length) {
      let given;
      if (message.reference?.messageId) { // if message is a reply to something
        let replied = await message.channel.messages.fetch(message.reference.messageId);
        given = fromEmbeds(replied.embeds)
      } else {
        given = toObject(message.content);
      }

      if (Object.keys(given).length) {
        let user = await client.users.fetch(mentions[0]);
        let charas = await client.findChar(user.username);

        if (charas.length) {
          embed.description = "Select the character to give to."

          components = arrayChunks(
            [... charas.map(x => {
              return {
                custom_id: "giveto:" + x.get("CHARACTER"),
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
        embed.description = "Could not find anything to give!"
      }
    } else {
      embed.description = "No user specified to add items to!"
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
  adminOnly: true
};

exports.help = {
  name: "give"
};