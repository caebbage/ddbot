module.exports = async client => {
  // Log that the bot is online.
  client.guilds.cache.each(guild => {
    guild.members.fetch()
  })
  console.log(`${client.user.tag}, ready to serve.`);
};