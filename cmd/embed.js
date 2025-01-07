exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  console.log("embed...")
  try {
    let embed = msg.content.substring((client.config.get("prefix") + "embed").length).trim();

    msg.channel.send({
      embeds: [
        embed
      ]
    })

    msg.delete()
  } catch (e) {
    msg.reply(
      {
        "content": "Invalid input.",
        "ephemeral": true
      }
    )
  }
  delete embed; return;
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "embed"
};