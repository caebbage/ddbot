exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  console.log("embed...")
  try {
    let embed = inputs.join(" ");

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
  enabled: false,
  DM: true,
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "embed"
};