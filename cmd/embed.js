const { parseEmbed } = require("../mdl/format.js")

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  function handleErr(message) {
    message.author.send({
      embeds: [{
        description: message,
        color: client.config.get("embed_color")
      }]
    })
    message.delete()
  }

  try {
      let link = /https:\/\/discord\.com\/channels\/(?<guild>.+)\/(?<channel>\d+)\/(?<message>\d+)/.exec(message.content);

      if (link) {
        let source = await (await client.channels.fetch(link.groups.channel))?.messages.fetch(link.groups.message);
        if (source) {
          let embed = parseEmbed(source.content);

          if (message.reference?.messageId) { // if message is a reply to something
            let replied = await message.channel.messages.fetch(message.reference.messageId);
            if (replied.editable) {
              replied.edit({
                embeds: [embed]
              })
              message.delete()
            } else {
              handleErr("Message replied to not editable.")
            }
          } else {
            message.channel.send({
              embeds: [embed]
            })
            message.delete()
          }
        } else {
          handleErr("Linked embed post not found.");
        }
      } else {
        handleErr("Specify a link for your embed contents.");
      }
    } catch (e) {
      console.log(e);
      handleErr("An error occured. Tell teru.");
  }
};



exports.conf = {
  enabled: true,
  DM: false,
  aliases: [],
  adminOnly: true
};

exports.help = {
  name: "embed"
};