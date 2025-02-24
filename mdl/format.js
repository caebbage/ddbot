async function makeInvEmbed(client, chara, user) {
  if (!user) user = client.users.cache.find(u => u.username.toLowerCase() == chara.MUN.toLowerCase())

  let inv = "";
  if (chara.GENERAL) inv += "GENERAL\n" + chara.GENERAL
  if (chara.OTHER) inv += "\n\n" + chara.OTHER

  inv = inv.trim().replace(/^(?!- )(.+)$/gm, "### $1").replace(/^- (.+)/gm, "-# - $1")
  if (inv == "") { inv = "-# - You don't seem to own anything..." }

  return {
    "author": {
      "icon_url": client.config.get("embed_author_icon"),
      name: "DD INC."
    },
    "thumbnail": {
      "url": client.config.get("embed_thumb")
    },
    "title": `◆ ${chara.CHARACTER}`,
    "description": inv,
    "url": chara.BASICS || undefined,
    "color": client.config.get("embed_color"),
    "footer": {
      "text": `played by ${chara.MUN} ◆ ${chara.TIMEZONE}`,
      "icon_url": user?.displayAvatarURL() || client.config.get('success_img')
    }
  }
}

async function makeCharEmbed(client, chara, user) {
  let self = (await client.db.chart.find(x => x.get("Name") == chara.CHARACTER))?.get(chara.CHARACTER);
  if (!user) user = client.users.cache.find(u => u.username.toLowerCase() == chara.MUN.toLowerCase())

  let statuses =  client.statuses
    ?.map(x => x.toObject()).filter(x => chara.STATS.split(", ").includes(x.STATUS))

  let stats = {
    E: (+chara.E),
    G: (+chara.G),
    O: (+chara.O),
    S: (+chara.S)
  }

  if (statuses.length) {
      stats.E += (statuses?.reduce((a, b) => a + +b.E, 0) || 0),
      stats.G += (statuses?.reduce((a, b) => a + +b.G, 0) || 0),
      stats.O += (statuses?.reduce((a, b) => a + +b.O, 0) || 0),
      stats.S += (statuses?.reduce((a, b) => a + +b.S, 0) || 0)
  }

  return {
    "author": {
      "icon_url": client.config.get("embed_author_icon"),
      name: "DD INC."
    },
    "thumbnail": {
      "url": client.config.get("embed_thumb")
    },
    "title": `◆ ${chara.CHARACTER}`,
    "description": `-# \`#${chara["ID #"]}\` of \`#${chara["REALITY #"]}\` ◆ `
      + `\`${chara.PRONOUNS}\` ◆ \`${chara.HEIGHT}\`\n\n`
      + (self ? `${self.split("\n").map(x => "> " + x).join("\n")}\n\n` : "")
      + `\`\`\`ansi\n\u001b[2;31m\u001b[1;31mLEVEL ${pad(chara.LEVEL)}\u001b[0m\u001b[2;31m\u001b[0m\n\`\`\`\n`
      + `\` DEATHS \` ${chara.DEATHS}　　\` HP \` ${chara.HP} \` MD \` ${chara.MD} \` EP \` ${chara.EP}\n\n`
      + `\`     ESSENCE \` ${isNaN(stats.E) ? "??" : (stats.E >= 0 ? "+" : "-") + pad(Math.abs(stats.E)) }　`
      + `\`        GRIT \` ${isNaN(stats.G) ? "??" : (stats.G >= 0 ? "+" : "-") + pad(Math.abs(stats.G)) }\n`
      + `\` OBSERVATION \` ${isNaN(stats.O) ? "??" : (stats.O >= 0 ? "+" : "-") + pad(Math.abs(stats.O)) }　`
      + `\`      SANITY \` ${isNaN(stats.S) ? "??" : (stats.S >= 0 ? "+" : "-") + pad(Math.abs(stats.S)) }`
      + (statuses.length ? 
        "\n```ansi\n"
        + statuses.map(st => 
          `[2;31m[1;31m[${st.STATUS}]` + (st.EFFECT ? ":[0m[2;31m[0m\n" +
            st.EFFECT : "[0m[2;31m[0m")
            + (st.STATS ? `\n  [2;31m[2;30m${st.STATS}[0m[2;31m[0m` : "")
        ).join("\n\n")
        + "```" 
        : "")
      ,
    "url": chara.BASICS || undefined,
    "color": client.config.get("embed_color"),
    "footer": {
      "text": `played by ${chara.MUN} ◆ ${chara.TIMEZONE}`,
      "icon_url": user?.displayAvatarURL() || client.config.get('success_img')
    }
  }
}
function pad(str, length = 2, pad = "0") {
  let string = "" + str;
  if (length - string.length > 0) {
    return pad.repeat(length - string.length) + string
  } else return string
}

const arrayChunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size))

const styleText = {
  charSets: {
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
  },
  format(style, str) {
    var oldSet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890.!?@#$%^&*()-_=+;:/~");
    var newSet = Array.from(this.charSets[style]);

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

function parseEmbed(src) {
  let res = {};
  res.title = /(?<=^\*\*Title:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()
  res.color = /(?<=^\*\*Color:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()
  res.description = /(?<=^\*\*Description:\*\*)((.*\n)*.*)/mi.exec(src)?.[0].trim()

  let author = {
    icon_url: /(?<=^\*\*AuthorPic:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()?.replace(/[<>]/g, ""),
    name: /(?<=^\*\*Author:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()
  };
  if (author.url || author.name) res.author = author

  let thumbnail = {
    url: /(?<=^\*\*Thumbnail:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()?.replace(/[<>]/g, "")
  }
  if (thumbnail.url) res.thumbnail = thumbnail;

  let image = {
    url: /(?<=^\*\*Image:\*\*)(.+)$/mi.exec(src)?.[0]?.trim()?.replace(/[<>]/g, "")
  }
  if (image.url) res.image = image;

  return removeEmpty(res);
}

function formatPool(src, format, parse = false) {
  return src.map(val => {
    let embed = { ... format }
    if (parse) {
      embed = { ...embed, ... parseEmbed(val)}
    } else {
      embed.description = val
    }
    return embed
  })
}

const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key]) newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = { makeCharEmbed, makeInvEmbed, pad, arrayChunks, styleText, parseEmbed, formatPool }