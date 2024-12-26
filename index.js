require('dotenv').config({silent: process.env.NODE_ENV === 'production'});

const Discord = require("discord.js"),
  client = new Discord.Client({ intents: 38401 }),
  { promisify } = require("util"),
  readdir = promisify(require("fs").readdir);

  

require("./mdl/sheets.js")(client);
require("./mdl/functions.js")(client);

client.cmd = {}, client.alt = {cmd: {}};

const init = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  const cmdFiles = await readdir("./cmd/");
  console.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.load('cmd', f);
    if (response) console.log(response);
  });

  const evtFiles = await readdir("./evt/");
  console.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    console.log(`  [evt] ${eventName}`);
    const event = require(`./evt/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    client.on(eventName, event.bind(null, client));
  });

  client.login(process.env.DISCORD_CLIENT_TOKEN);
};

init();