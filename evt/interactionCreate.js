const { makeCharEmbed, makeInvEmbed } = require("../mdl/format.js");
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

      if (interaction.customId.indexOf("inv:") == 0) {
        let name = interaction.customId.substring(4);

        let chara = (await client.findChar(name)).toObject()

        interaction.update({
          embeds: [await makeInvEmbed(client, chara)]
        })
      }

      if (interaction.customId.indexOf("giveto:") == 0) {
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

      if (interaction.customId.indexOf("giftfrom:") == 0) {

      }
    } catch (err) { console.log(err) }
  } else {
    interaction.deferUpdate().catch(err => console.log(err));
  }
}