exports.run = async (client, msg, inputs, comment) => { // eslint-disable-line no-unused-vars
  console.log("embed...")
  try {
    let embed = JSON.parse(inputs.join(" ").trim());

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