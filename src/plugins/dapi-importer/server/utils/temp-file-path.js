const os = require("os");
const path = require("path");

const tempFilePath = (filename) => path.join(os.tmpdir(), filename);

module.exports = tempFilePath;
