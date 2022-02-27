var https = require("https");
var fs = require("fs");

module.exports = async (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close(() => {
            resolve(file);
          });
        });
      })
      .on("error", function (err) {
        fs.unlink(dest, () => console.log("unlink"));
        reject(err.message);
      });
  });
};
