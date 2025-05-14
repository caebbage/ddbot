module.exports = async client => {
  // Log that the bot is online.
  client.guilds.cache.each(guild => {
    guild.members.fetch()
  })

  try {
    client.user.setPresence({
      activities: [{
        name: 'Lost? Try dd!help',
        type: 4
      }],
      status: 'online'
    })
  } catch (err) {
    console.log(err)
  }

  console.log(`${client.user.tag}, ready to serve.`);
};