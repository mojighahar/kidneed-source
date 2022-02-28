const fs = require("fs");
const mime = require("mime-types");
const download = require("./download");
const urlFilename = require("./url-filename");
const tempFilePath = require("./temp-file-path");

const downloadResource = async (url) => {
  const dest = tempFilePath(urlFilename(url));
  await download(url, dest);

  const stats = fs.statSync(dest);

  return {
    path: dest,
    name: urlFilename(url),
    size: stats.size,
    type: mime.lookup(dest),
  };
};

module.exports = downloadResource;
