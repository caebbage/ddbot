exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars

  var embeds = [];

  if (inputs.length < 1) {
    embeds = [{
      description: `Please use the command such as \`${client.config.get('prefix') || 'dd!'}path pathname\`!`,
      color: client.config.get('embed_color')
    }]
  } else {
    try {
      if (client.paths.find((val) => val.get("name").toLowerCase() == inputs[0])) {
        let sheet = client.paths.find((val) => val.get("name").toLowerCase() == inputs[0]);

        let pathData = (await client.data.sheetsById[sheet.get("id")].getRows())
          .map(x => x.toObject()).filter((val) => val.value && !isNaN(val.weight));

        inputs.shift()

        let subpath = inputs.length ? inputs.join(" ").toLowerCase() : "default";

        let validPaths = pathData.filter((x) =>
          x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes(subpath))

        if (validPaths > 0) {
          let pathSize = 0
          validPaths.forEach((val) => {
            pathSize += +val.weight
          })

          let rng = Math.random() * pathSize;

          for (let item of validPaths) {
            if (rng < +item.weight) {
              embeds.push({
                description: item.value,
                color: client.config.get("embed_color")
              })
              break;
            } else {
              rng -= +item.weight
            }
          }
        } else {
          
          let errorPath = pathData.filter((x) =>
            x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes("error"));

          embeds = [{
            description: errorPath[0].value || `Subpath not found... double check if you typoed, and ping teru if you didn't.`,
            color: client.config.get('embed_color')
          }]

          delete errorPath;
        }

        delete pathData, subpath, validPaths, sheet;
      } else {
        embeds = [{
          description: `Path not found!`,
          color: client.config.get('embed_color')
        }]
      }
    } catch (err) {
      console.log(err);
      embeds = [{
        description: `An error occured; check logs.`,
        color: client.config.get('embed_color')
      }]
    }
  }

  message.reply({
    embeds
  })
  delete embeds;
  return;
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