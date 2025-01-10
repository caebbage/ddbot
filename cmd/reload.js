exports.run = async (client, message, action) => { // eslint-disable-line no-unused-vars
    try {
        client.unload("cmd", action);
        client.load("cmd", action);
        message.react("✅")
    } catch (e) {
        console.log(e);
        message.react("❌");
    }
    return;
}

exports.conf = {
    enabled: false,
    DM: true,
    aliases: [],
    adminOnly: true
};

exports.help = {
    name: "reload"
};