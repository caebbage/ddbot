const { parseEmbed, formatPool, arrayChunks } = require("../mdl/format.js")

exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars

  var embed = {
    description: "",
    color: client.config.get('embed_color')
  },
    components;

  var options = {}

  if (inputs.length) {
    try {
      let pathName = inputs.shift().toLowerCase();
      let cmd = client.paths.find((val) => val.get("name").toLowerCase() == pathName);

      if (cmd) {
        if (cmd.get("mod_only") === "FALSE" || client.isModerator(message.member)) {
          let pathData = (await client.data.sheetsById[cmd.get("id")].getRows())
            .map(x => x.toObject()).filter((val) => val.value && !isNaN(val.weight));

          let configData = pathData.filter((x) =>
            x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes("config"))?.[0]
          if (configData) {
            embed = parseEmbed(configData.value)
            options.embedFormat = /(?<=^\*\*EmbedFormat:\*\*) ?true$/mi.test(configData.value)
            options.buttonColor = /(?<=^\*\*ButtonColor:\*\*) ?(\d+)$/mi.exec(configData.value)?.[0]?.trim()
          }

          let subpath = inputs.length ? inputs.join(" ").toLowerCase() : "default";
          if (cmd.get("tabs") === "TRUE") {
            let paths = [];
            pathData.forEach(path => {
              path.subpaths.split(",").map(x => x.trim()).filter(x => x.toLowerCase() != "default").forEach(sub => {
                if (!paths.includes(sub) && !["config", "error"].includes(sub)) paths.push(sub)
              })
            })

            if (paths.length) {
              components = arrayChunks(
                paths.map(x => {
                  return {
                    custom_id: `path:${pathName} ${x}`,
                    type: 2,
                    style: options.buttonColor || 4,
                    label: x
                  }
                }), 5).map((x) => {
                  return {
                    type: 1,
                    components: x
                  }
                })
            }
          }

          let validPaths = pathData.filter((x) =>
            x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes(subpath.toLowerCase()))

          if (validPaths.length) {
            let embeds = formatPool(client.drawPool(validPaths), embed, options.embedFormat);
            embed = embeds[0];
          } else {
            let errorPath = pathData.filter((x) =>
              x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes("error"));

            embed.description = errorPath[0]?.value || `Subpath not found... double check if you typoed, and ping teru if you didn't.`
          }
        } else {
          embed.description = `You don't have the permissions to use this pool!`
        }
      } else {
        embed.description = `Path not found!`
      }
    } catch (err) {
      console.log(err);
      embed.description = `An error occured; check logs.`
    }
  } else {
    embed.description = `Please use the command such as \`${client.config.get('prefix') || 'dd!'}path pathname\`!`
  }

  message.reply({
    embeds: [embed],
    components
  })
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "path"
};