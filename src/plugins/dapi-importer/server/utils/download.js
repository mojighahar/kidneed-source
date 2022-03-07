var https = require("https");
var fs = require("fs");

async function download(url, dest, repeat = 0, err = null) {
  return new Promise((resolve, reject) => {
    if (repeat > 2) {
      reject(err.message);
    }

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
        fs.unlink(dest, () => download(url, dest, repeat + 1, err));
      });

    file.on("error", (err) => {
      fs.unlink(dest, () => reject(err.message));
    });
  });
}

module.exports = download;
