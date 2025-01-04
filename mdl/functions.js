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

  client.pad = function (str, length = 2, pad = "0") {
    let string = "" + str;
    let diff = length - string.length;
    if (diff > 0) {
      return pad.repeat(diff) + string
    } else return string
  }

  client.makeInvEmbed = async function(chara, user) {
    if (!user) user = client.users.cache.find(u => u.username.toLowerCase() == chara.MUN.toLowerCase())

    let inv = "";
    if (chara.GENERAL) inv += "GENERAL\n" + chara.GENERAL
    if (chara.GIFTED) inv += "\n\nGIFTED\n" + chara.GIFTED
    if (chara.SPECIAL) inv += "\n\nSPECIAL\n" + chara.SPECIAL

    inv = inv.trim().replace(/^(?!- )(.+)$/gm, "### $1").replace(/^- (.+)/gm, "-# - $1")
    if (inv == "") {inv = "-# - You don't seem to own anything..."}

    return {
      "title": `◆ ${chara.CHARACTER}`,
      "description": inv,
      "url": chara.BASICS || undefined,
      "color": "#bf0000",
      "footer": {
        "text": `played by ${chara.MUN} ◆ ${chara.TIMEZONE}`,
        "icon_url": user?.displayAvatarURL() || client.config.get('success_img')
      }
    }
  }

  client.makeCharEmbed = async function (chara, user) {
    let self = (await client.db.chart.find(x => x.get("Name") == chara.CHARACTER))?.get(chara.CHARACTER);
    if (!user) user = client.users.cache.find(u => u.username.toLowerCase() == chara.MUN.toLowerCase())

    return {
      "title": `◆ ${chara.CHARACTER}`,
      "description": `-# \`#${chara["ID #"]}\` of \`#${chara["REALITY #"]}\` ◆ `
      + `\`${chara.PRONOUNS}\` ◆ \`${chara.HEIGHT}\`\n\n`
      + (self ? `${self.split("\n").map(x => "> " + x).join("\n")}\n\n` : "")
      + `\`\`\`ansi\n\u001b[2;31m\u001b[1;31mLEVEL ${this.pad(chara.LEVEL)}\u001b[0m\u001b[2;31m\u001b[0m\n\`\`\`\n`
      + `\` DEATHS \` ${chara.DEATHS}　　 \` MD \` ${chara.MD} \` EP \` ${chara.EP}\n\n`
      + `\`     ESSENCE \` ${(isNaN(+chara.E) || +chara.E >= 0) ? "+" : "-"}${isNaN(+chara.E) ? chara.E : this.pad(Math.abs(+chara.E))}　`
      + `\`        GRIT \` ${(isNaN(+chara.G) || +chara.G >= 0) ? "+" : "-"}${isNaN(+chara.G) ? chara.G : this.pad(Math.abs(+chara.G))}\n`
      + `\` OBSERVATION \` ${(isNaN(+chara.O) || +chara.O >= 0) ? "+" : "-"}${isNaN(+chara.O) ? chara.O : this.pad(Math.abs(+chara.O))}　`
      + `\`      SANITY \` ${(isNaN(+chara.S) || +chara.S >= 0) ? "+" : "-"}${isNaN(+chara.S) ? chara.S : this.pad(Math.abs(+chara.S))}`,
      "url": chara.BASICS || undefined,
      "color": "#bf0000",
      "footer": {
        "text": `played by ${chara.MUN} ◆ ${chara.TIMEZONE}`,
        "icon_url": user?.displayAvatarURL() || client.config.get('success_img')
      }
    }
  };
  
  // makes text FANCY
  client.styleText = function (style, str) {
    const charaSets = {
      "bold": "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗𝟎",
      "smallcaps": "ABCDEFGHIJKLMNOPQRSTUVWXYZᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ",
      "superscript": "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁⱽᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ¹²³⁴⁵⁶⁷⁸⁹⁰",
      "typewriter": "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿𝟶",
      "double": "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡𝟘",
      "cursive": "𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏",
      "cursbold": "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
      "gothic": "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
      "gothbold": "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
      "wide": "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ１２３４５６７８９０．！？＠＃＄％^＆＊（）－_＝＋；：／~"
    };
    var oldSet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.!?@#$%^&*()-_=+;:/~");
    var newSet = Array.from(charaSets[style]);

    var input = Array.from(str);
    var result = '';

    input.forEach((val) => {
      if (oldSet.includes(val) && newSet[oldSet.findIndex((ele) => ele == val)]) {
        result += newSet[oldSet.findIndex((ele) => ele == val)]
      } else {
        result += val;
      }
    })

    return result
  }
}