exports.run = async (client, message, action) => { // eslint-disable-line no-unused-vars
  try {
    await client.refreshData();
    message.react("✅")
  } catch (e) {
    console.log(e);
    message.react("❌");
  }
  return;
}

exports.conf = {
  enabled: true,
  DM: false,
  aliases: [],
  adminOnly: true
};

exports.help = {
  name: "refresh"
};