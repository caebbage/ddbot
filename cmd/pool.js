exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars

  var embeds = [];

  if (inputs.length < 1) {
    embeds = [{
      description: `Please use the command such as \`${client.config.get('prefix') || 'dd!' }pool poolname [times]\`!`,
      color: client.config.get('embed_color')
    }]
  } else {
    if (client.pools.find((val) => val.get("name").toLowerCase() == inputs[0])) {
      let sheet = client.pools.find((val) => val.get("name").toLowerCase() == inputs[0]);
  
      let poolData = (await client.data.sheetsById[sheet.get("id")]).getRows()
      let poolSize = 0;
  
      poolData.forEach((val) => {
        poolSize += +val.get("weight")
      })
  
      let rollCnt = sheet.get("multi").toUpperCase() == "TRUE" ? Math.min(Math.max(isNaN(+inputs[1]) ? false : +inputs[1] || 1, 1), 10) : 1;

      for (let i = 0; i < rollCnt; i++) {
        let rng = Math.random() * poolSize;

        for (let item of poolData) {
          if (rng < +item.get("weight")) {
            embeds.push({
              description: item.get("value"),
              color: client.config.get("embed_color")
            })
            break;
          } else {
            rng -= +item.get("weight")
          }
        }
      }
    } else {
      embeds = [{
        description: `Pool not found!`,
        color: client.config.get('embed_color')
      }]
    }
  }

  message.reply({
    embeds
  })
};

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ['p'],
  adminOnly: false
};

exports.help = {
  name: "pool"
};