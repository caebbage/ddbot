// The msg event runs anytime a msg is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, msg) => {
  try {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
    if (msg.author.bot) return;

    const prefix = client.config.get('prefix') || 'dd!';

    // Checks if the bot was mentioned, with no msg after it, returns the prefix.
    if (msg.content.match(new RegExp(`^<@!?${client.user.id}>`))) {
      return msg.reply(`My prefix is \`${prefix}\`!`);
    }

    // ignore messages not starting with prefix
    if (msg.content.indexOf(prefix) !== 0) return;

    var args = msg.content.slice(prefix.length).trim()

    const command = (args.indexOf(" ") != -1 ? args.slice(0, args.indexOf(' ')) : args).toLowerCase()
    // check if command exists
    const cmd = client.cmd[command] || client.alt.cmd[command] && client.cmd[client.alt.cmd[command]]

    let comment;

    if (args.includes(" # ")) {
      comment = args.slice(args.indexOf(" # ") + 3).trim();
      args = args.slice(0, args.indexOf(" # "));
    }

    args = args.trim().split(" ").filter(x => x !== "");
    args.shift();

    if (cmd) {
      // check if command is available via DM
      if (!msg.guild && !cmd.conf.DM)
        return msg.reply("This command is unavailable via private msg.");

      console.log(`  [cmd] ${cmd.help.name}: ${msg.author.username} (${msg.author.id})`);

      cmd.run(client, msg, args, comment);
    } else {
      // if there is a pool command of that name
      if (client.pools.find((val) => val.get("name").toLowerCase() == command)) {
        console.log(`  [pool] ${command}: ${msg.author.username} (${msg.author.id})`);
        
        client.cmd['pool'].run(client, msg, [command, ...args], comment);
      }
    }
  } catch (err) {
    msg.reply({
      embeds: [{
        description: "**An error occured:** " + err,
        color: client.config.get('embed_color')
      }]
    })
  }
};