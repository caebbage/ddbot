const { makeInvEmbed, arrayChunks } = require("../mdl/format.js");

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  },
    components;

  try {
    let result;
    if (!inputs.length || [...message.mentions.members].length) {
      let user = [...message.mentions?.members]?.[0]?.[1].user || message.author;
      result = await client.findChar(user.username || user.user.username);
    } else {
      result = await client.findChar(inputs.join(" "));
    }

    if (result.length) {
      const res = result.map(x => x.toObject());

      embed = await makeInvEmbed(client, res[0]);

      if (res.length > 1) {
        let buttons = res.map(x => {
          return {
            custom_id: "inv:" + x.CHARACTER,
            type: 2,
            style: 4,
            label: x.CHARACTER
          }
        })

        components = arrayChunks(buttons, 5).map((x) => {
          return {
            type: 1,
            components: x
          }
        })
      }
    } else {
      embed.description = "No characters found! (Let teru know if this is an error.)"
    }
  } catch (err) {
    console.log(err)
    embed.description = "Something went wrong. Tell teru."
  }

  message.reply({
    embeds: [embed],
    components
  })
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ["inventory"],
  adminOnly: false
};

exports.help = {
  name: "inv"
};