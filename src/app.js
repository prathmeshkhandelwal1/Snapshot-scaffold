const fs = require("fs");
const path = require("path");

const showrunnersPath = path.join(__dirname, "/showrunners");
fs.mkdirSync(showrunnersPath);

const channelPath = path.join(showrunnersPath, "/testingChannel");

fs.mkdirSync(channelPath);

fs.writeFile(
  channelPath + "/testingChannelJobs.ts",
  `import logger from '../../loaders/logger'`,
  function (err) {
    if (err) throw err;
    console.log("Results Received");
  }
);

console.log(__dirname);
