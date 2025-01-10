exports.run = async (client, message, inputs, comment) => { // eslint-disable-line no-unused-vars
  const { writeHeapSnapshot } = require('node:v8');
  
  writeHeapSnapshot()

  message.reply({
    content: 'Heap written.',
    //files: ['heap.heapsnapshot']
  })
};

exports.conf = {
  enabled: false,
  DM: true,
  aliases: [],
  adminOnly: false
};

exports.help = {
  name: "heap"
};