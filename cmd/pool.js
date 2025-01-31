exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars

  var embeds = [];

  if (inputs.length < 1) {
    embeds = [{
      description: `Please use the command such as \`${client.config.get('prefix') || 'dd!' }pool poolname [times]\`!`,
      color: client.config.get('embed_color')
    }]
  } else {
    try {
      let pathName = inputs.shift().toLowerCase();
      let cmd = client.pools.find((val) => val.get("name").toLowerCase() == pathName);
      if (cmd) {
        if (cmd.get("mod_only") === "FALSE" || client.isModerator(message.member)) {
          let poolData = (await client.data.sheetsById[cmd.get("id")].getRows())
            .map(x => x.toObject()).filter((val) => val.value && !isNaN(val.weight));
          if (poolData.length) {
            let rollCnt = cmd.get("multi").toUpperCase() == "TRUE" ? Math.min(Math.max(isNaN(+inputs[0]) ? false : +inputs[0] || 1, 1), 10) : 1;
          
          let embeds = formatPool(client.drawPool(poolData, rollCnt), embeds[0]);
          } else {
            embeds[0].description = "The pool is empty! (If this is unexpected, check with Teru!)"
          }
        } else {
          embeds[0].description = `You don't have the permissions to use this Pool!`
        }
        delete cmd;
      } else {
        embeds[0].description = `Pool not found!`
      }
    } catch (err) {
      console.log(err);
      embeds[0].description = `An error occured; check logs.`
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
  name: "pool"
};