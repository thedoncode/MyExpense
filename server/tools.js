// Helpers for setting up the server. Run from the project folder:
//   node server/tools.js new-key     a DATA_KEY (32 random bytes, base64)
//   node server/tools.js new-token   a SETUP_TOKEN
// (The setup page the server shows before it's configured also makes both, in your browser.)
const crypto = require('crypto');
const cmd = process.argv[2];
if (cmd === 'new-key') console.log(crypto.randomBytes(32).toString('base64'));
else if (cmd === 'new-token') console.log(crypto.randomBytes(32).toString('base64url'));
else { console.log('Usage: node server/tools.js new-key | new-token'); process.exit(1); }
