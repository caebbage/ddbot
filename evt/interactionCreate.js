module.exports = async (client, interaction) => {
  if (!interaction.isButton()) return;
  
  console.log(`    [interact] ${interaction.customId} (for ${interaction.message.id})`)
  if (interaction.customId.indexOf("char:") == 0) {
    try {
      let name = interaction.customId.substring(5);

      let original = interaction.message.toJSON();

      let chara = (await client.db.charas.find((x) => {
        return x.get("CHARACTER") == name
      }) || await client.db.npcs.find((x) => {
        return x.get("CHARACTER") == name
      })).toObject()
      
      interaction.update({
        embeds: [await client.makeCharEmbed(chara)],
        components: original.components
      })
    } catch (err) {console.log(err)}
  }
  
  if (interaction.customId.indexOf("inv:") == 0) {
    try {
      let name = interaction.customId.substring(4);

      let original = interaction.message.toJSON();

      let chara = (await client.db.charas.find((x) => {
        return x.get("CHARACTER") == name
      }) || await client.db.npcs.find((x) => {
        return x.get("CHARACTER") == name
      })).toObject()
      
      interaction.update({
        embeds: [await client.makeInvEmbed(chara)],
        components: original.components
      })
    } catch (err) {console.log(err)}
  }
}