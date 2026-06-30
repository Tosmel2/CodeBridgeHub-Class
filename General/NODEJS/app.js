// This runs on your server — no browser needed!
console.log("Hello from Node.js!");

// Node gives you access to the OS
const os = require("os");
console.log(`Platform: ${os.platform()}`);
console.log(`CPU cores: ${os.cpus().length}`);
console.log(`Free memory: ${Math.round(os.freemem() / 1e6)} MB`);