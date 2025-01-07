exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  let embed = {
    description: "",
    color: client.config.get("embed_color")
  };

  const fuzzy = require('fuzzy');

  const list = (await client.db.chart.map(x => {
    return {
      name: x.get("Name"),
      mun: x.get("Mun")
    }
  })).filter(x => x.name)

  try {
    if (!inputs.length || [...message.mentions.members].length) {
      let author = [...message.mentions?.members]?. [0]?. [1].user || message.author;

      if (!list.find(x => x.mun.toLowerCase() == (author.username?.toLowerCase() || author.user.username.toLowerCase()))) {
        embed.description = "You don't seem to have any characters! (Ping teru if this is an error.)"
        message.reply({
          embeds: [
            embed
          ]
        })
        delete list, embed; return;
      } else {
        const res = [
          ...await client.db.charas.filter((x) => x.get("MUN").toLowerCase() == author.username.toLowerCase()),
          ...await client.db.npcs.filter((x) => x.get("MUN").toLowerCase() == author.username.toLowerCase())
        ].map(x => x.toObject());

        embed = await client.makeCharEmbed(res[0], author);

        if (res.length > 1) {

          let buttons = res.map(x => {
            return {
              custom_id: "char:" + x.CHARACTER,
              type: 2,
              style: Object.keys(x).includes("INVENTORY") ? 4 : 2,
              label: x.CHARACTER
            }
          })

          let components = array_chunks(buttons, 5).map((x) => {
            return {
              type: 1,
              components: x
            }
          })

          message.reply({
            embeds: [embed],
            components
          })
          delete buttons, components;
        } else {
          message.reply({
            embeds: [embed]
          })
        }
        delete list, res, embed; return;
      }
    } else {
      let results = list.find(x => x.name.toLowerCase().includes(`"${inputs.join(" ").toLowerCase()}"`)) ||
        fuzzy.filter(inputs.join(" "), list, {
          extract: (x) => x.name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
        });

      if (results.length) {
        let chara = (await client.db.charas.find((x) => {
          return x.get("CHARACTER").normalize('NFD').replace(/\p{Diacritic}/gu, '') == results[0].string
        }) || await client.db.npcs.find((x) => {
          return x.get("CHARACTER").normalize('NFD').replace(/\p{Diacritic}/gu, '') == results[0].string
        })).toObject()

        message.reply({
          embeds: [await client.makeCharEmbed(chara)]
        })
        delete chara;
      } else {
        embed.description = "No such character found."
        message.reply({
          embeds: [embed]
        })
      }
      delete list, results, embed; return;
    }
  } catch (err) {
    console.log(err)
    embed.description = "Something went wrong. Tell teru."
    message.reply({
      embeds: [embed]
    })
    delete list, embed; return;
  }
};

const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

exports.conf = {
  enabled: true,
  DM: true,
  aliases: ["character", "char"],
  adminOnly: false
};

exports.help = {
  name: "chara"
};