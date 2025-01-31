const { makeCharEmbed, makeInvEmbed, arrayChunks, parseEmbed, formatPool } = require("../mdl/format.js");
const inventory = require("../mdl/inventory.js");

module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;

  console.log(`    [interact] ${interaction.customId} (for ${interaction.message.id})`)

  let src = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId);
  if (interaction.user.id == src.author.id) {
    try {
      if (interaction.customId.indexOf("char:") == 0) {
        let name = interaction.customId.substring(5);

        let chara = (await client.findChar(name, true)).toObject()

        interaction.update({
          embeds: [await makeCharEmbed(client, chara)]
        })
      }
      else if (interaction.customId.indexOf("inv:") == 0) {
        let name = interaction.customId.substring(4);

        let chara = (await client.findChar(name)).toObject()

        interaction.update({
          embeds: [await makeInvEmbed(client, chara)]
        })
      }
      else if (interaction.customId.indexOf("giveto:") == 0) {
        let name = interaction.customId.substring(7).trim();

        let chara = await client.findChar(name);

        let inv = inventory.toObject(chara[0].get("GENERAL"));

        let given;
        if (src.reference?.messageId) { // if message is a reply to something
          let replied = await src.channel.messages.fetch(src.reference.messageId);
          given = inventory.fromEmbeds(replied.embeds)
        } else {
          given = inventory.toObject(src.content);
        }

        let give = await client.db.charas.set(chara[0], "GENERAL", inventory.toString(inventory.give(inv, given)));
        if (give) {
          interaction.update({
            embeds: [{
              description: "`" + chara[0].get("CHARACTER") + "` has received the following items:\n" + inventory.toString(given).replace(/^/gm, "> "),
              color: client.config.get('embed_color')
            }],
            components: []
          })
        }
      }
      else if (interaction.customId.indexOf("takefrom:") == 0) {
        let name = interaction.customId.substring(9).trim();

        let chara = await client.findChar(name);

        let inv = inventory.toObject(chara[0].get("GENERAL"));

        let taken = inventory.toObject(src.content);
        let take = inventory.take(inv, taken);
        if (take) {
          let update = await client.db.charas.set(chara[0], "GENERAL", inventory.toString(take));
          if (update) {
            interaction.update({
              embeds: [{
                description: "`" + chara[0].get("CHARACTER") + "` has lost the following items:\n" + inventory.toString(taken).replace(/^/gm, "> "),
                color: client.config.get('embed_color')
              }],
              components: []
            })
          } else {
            interaction.update({
              embeds: [{
                description: "Some sort of error occured.",
                color: client.config.get('embed_color')
              }],
              components: []
            })
          }
        } else {
          interaction.update({
            embeds: [{
              description: "`" + chara[0].get("CHARACTER") + "` does not have the all of the requested items!\n-# If you think this is an error, tell teru.",
              color: client.config.get('embed_color')
            }],
            components: []
          })
        }
      }
      else if (interaction.customId.indexOf("giftfrom:") == 0) {
        let name = interaction.customId.substring(9).trim();

        let chara = await client.findChar(name);

        let inv = inventory.toObject(chara[0].get("GENERAL"));

        let taken = inventory.toObject(src.content);
        let take = inventory.take(inv, taken);

        if (take) {
          let target = await client.users.fetch(src.content.match(/(?<=<@!?)\d+(?=>)/g)[0]);

          if (target) {
            let charas = (await client.findChar(target.username)).filter(char => char.get("CHARACTER") != name)
            if (charas.length) {
              let components = arrayChunks(
                charas.map(x => {
                  return {
                    custom_id: "giftto:" + x.get("CHARACTER"),
                    type: 2,
                    style: 4,
                    label: x.get("CHARACTER")
                  }
                })
                , 5).map((x) => {
                  return {
                    type: 1,
                    components: x
                  }
                })
              interaction.update({
                embeds: [{
                  description: "`" + chara[0].get("CHARACTER") + "` is gifting to...\nSelect your recipient.",
                  color: client.config.get('embed_color')
                }],
                components
              })
            } else {
              interaction.update({
                embeds: [{
                  description: "Could not find characters for recipient.",
                  color: client.config.get('embed_color')
                }],
                components: []
              })
            }
          } else {
            interaction.update({
              embeds: [{
                description: "Could not find recipient.",
                color: client.config.get('embed_color')
              }],
              components: []
            })
          }
        } else {
          interaction.update({
            embeds: [{
              description: "`" + name + "` does not have the listed items.",
              color: client.config.get('embed_color')
            }],
            components: []
          })
        }
      }
      else if (interaction.customId.indexOf("giftto:") == 0) {
        let srcName = interaction.message.embeds[0].description.match(/(?<=`).+(?=`)/)[0];
        let targName = interaction.customId.substring(7).trim();

        let srcChar = (await client.findChar(srcName))[0];
        let targChar = (await client.findChar(targName))[0];

        let srcInv = inventory.toObject(srcChar.get("GENERAL"));
        let targInv = inventory.toObject(targChar.get("GENERAL"));

        let items = inventory.toObject(src.content);

        let take = inventory.take(srcInv, items);
        if (take) {
          let give = inventory.give(targInv, items);

          let taken = await client.db.charas.set(srcChar, "GENERAL", inventory.toString(take));
          if (taken) {
            let given = await client.db.charas.set(targChar, "GENERAL", inventory.toString(give));

            if (given) {
              interaction.update({
                embeds: [{
                  description: `\`${srcName}\` has gifted the following items to \`${targName}\`:\n` + inventory.toString(items).replace(/^/gm, "> "),
                  color: client.config.get('embed_color')
                }],
                components: []
              })
            } else {
              interaction.update({
                embeds: [{
                  description: "Error occured while adding items.",
                  color: client.config.get('embed_color')
                }],
                components: []
              })
            }
          } else {
            interaction.update({
              embeds: [{
                description: "Error occured while taking items.",
                color: client.config.get('embed_color')
              }],
              components: []
            })
          }
        } else {
          interaction.update({
            embeds: [{
              description: "Lacking required items.",
              color: client.config.get('embed_color')
            }],
            components: []
          })
        }
      }
      else if (interaction.customId.indexOf("path:") == 0) {
        let input = interaction.customId.substring(5).trim().split(" "),
          pathName = input.shift(),
          embed = {... interaction.message.embeds[0]},
          options = {};

        let cmd = client.paths.find((val) => val.get("name").toLowerCase() == pathName);
        if (cmd) {
          if (cmd.get("mod_only") === "FALSE" || client.isModerator(message.member)) {
            let pathData = (await client.data.sheetsById[cmd.get("id")].getRows())
              .map(x => x.toObject()).filter((val) => val.value && !isNaN(val.weight));
  
            let configData = pathData.filter((x) =>
              x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes("config"))?.[0]
            if (configData) {
              embed = {... embed, ... parseEmbed(configData.value)}
              options.embedFormat = /(?<=^\*\*EmbedFormat:\*\*) ?true$/mi.test(configData.value)
              options.buttonColor = /(?<=^\*\*ButtonColor:\*\*) ?(\d+)$/mi.exec(configData.value)?.[0]?.trim()
            }
  
            let subpath = input.join(" ").trim();
            let validPaths = pathData.filter((x) =>
              x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes(subpath))
  
            if (validPaths.length) {
              let embeds = formatPool(client.drawPool(validPaths), embed, options.embedFormat);
              embed = embeds[0];
            } else {
              let errorPath = pathData.filter((x) =>
                x.subpaths.split(",").map(x => x.toLowerCase().trim()).includes("error"));
  
              embed.description = errorPath[0].value || `Subpath not found!`
            }
          } else {
            embed.description = `You don't have the permissions to use this pool!`
          }
        } else {
          embed.description = `Pool not found!`
        }
        interaction.update({
          embeds: [embed]
        })
      }
    } catch (err) { console.log(err) }
  } else {
    interaction.deferUpdate().catch(err => console.log(err));
  }
}