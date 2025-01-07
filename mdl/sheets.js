const { config } = require('dotenv');

module.exports = async (client) => {
  const { GoogleSpreadsheet } = require('google-spreadsheet');
  const { JWT } = require('google-auth-library');

  // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
  const serviceAccountAuth = new JWT({
    // env var values here are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  client.data = new GoogleSpreadsheet('1JL1pbEePQltqzTDVR-HaT5sKGUK_g7X6PbZmj-LorZw', serviceAccountAuth);

  client.db = {
    src: new GoogleSpreadsheet('1JeXEb5R7MuF8IsnKfTNd5E5nMf3gwU93iVENB5M41-8',  serviceAccountAuth),
  }; 

  // get info from bot config sheets
  client.refreshData = async function () {
    await client.data.loadInfo();
    client.config = (await client.data.sheetsById[0].getRows())[0];
    client.pools = await client.data.sheetsById[client.config.get("commands")].getRows();
    
    console.log("Config and pools refreshed.")
  }
  
  client.refreshData();

  // get infrom from database
  await client.db.src.loadInfo();

  client.db.charas = await sheetSetup(0, 4);
  client.db.npcs = await sheetSetup('382892795', 3);
  client.db.chart = await sheetSetup('902346809', 3);

  async function sheetSetup(id, rows) {
    await client.db.src.sheetsById[id].loadHeaderRow(rows)

    return {
      src: async () => await client.db.src.sheetsById[id].getRows(),
      async find (func) {
        return (await this.src()).find(func);
      },
      async filter (func) {
        return (await this.src()).filter(func);
      },
      async map (func) {
        return (await this.src()).map(func);
      }
    }
  }
}