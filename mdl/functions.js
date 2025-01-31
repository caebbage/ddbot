const fuzzy = require('fuzzy');

module.exports = (client) => {
  // waits for a reply to a message and then returns that reply
  client.awaitReply = async (msg, question, limit = 30000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.reply(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first();
    } catch (e) {
      return false;
    }
  }
  // loads functions
  client.load = (type, name) => {
    try {
      console.log(`  [${type}] ${name}`);
      const props = require(`../${type}/${name}`); // fetch file

      client[type][props.help.name] = props; // attach function to client

      props.conf.aliases.forEach(alias => {
        client.alt[type][alias] = props.help.name; // attach aliases to client
      });
      return false;
    } catch (e) {
      return `Unable to load ${name}: ${e}\n${e.stack}`;
    }
  };
  // unloads functions (removes them from memory)
  client.unload = async (type, name) => {
    let command;
    if (client[type][name]) {
      command = client[type][name];
    } else if (client.alt[type][name]) {
      command = client[type][client.alt[type][name]];
    }
    if (!command) return `The ${type} \`${name}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    delete require.cache[require.resolve(`../${type}/${command.help.name}.js`)]; // nuke cache
    command.conf.aliases.forEach((v) => { // nuke aliases
      delete client.alt[type][v]
    })
    delete client[type][name]; // nuke actual command
    return false;
  };

  client.isModerator = async function (member) {
    if (member?.roles.cache.get(client.config.get("moderator_role"))) return true
    else return false
  }

  client.findChar = async function (search, withNPC) {
    const list = (withNPC
      ? (await client.db.chart.map(x => {
        return {
          name: x.get("Name"),
          mun: x.get("Mun")?.toLowerCase()
        }
      }))
      : (await client.db.charas.map(x => {
        return {
          name: x.get("CHARACTER"),
          mun: x.get("MUN")?.toLowerCase()
        }
      }))).filter(x => x.name)

    // username match
    const userSearch = list.filter(x => {
      return x.mun == search.toLowerCase()
    }).map(x => x.name)

    // chara name match

    var charaSearch = [list.find(x => x.name.toLowerCase().includes(`"${search.toLowerCase()}"`))]
    if (!charaSearch[0]) charaSearch = fuzzy.filter(search, list, {
      extract: (x) => x.name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    }).map(x => x.original.name);

    if (userSearch.length || charaSearch.length) {
      const entries = [
        ... await client.db.charas.filter((x) => x.get("CHARACTER")),
        ... (withNPC ? await client.db.npcs.filter((x) => x.get("CHARACTER")) : [])
      ]

      if (userSearch.length) {
        return entries.filter(x => userSearch.includes(x.get("CHARACTER")))
      } else {
        return [entries.find(x => x.get("CHARACTER") == charaSearch[0])]
      }
    } else return false
  }

  client.drawPool = function (pool, amt = 1) {
    let poolSize = 0,
      result = []

    pool.forEach((item) => {
      poolSize += +item.weight
    })

    for (let i = 0; i < amt; i++) {
      let rng = Math.random() * poolSize;

      for (let item of pool) {
        if (rng < +item.weight) {
          result.push(item.value)
          break;
        } else rng -= +item.weight
      }
    }
    return result;
  }
}