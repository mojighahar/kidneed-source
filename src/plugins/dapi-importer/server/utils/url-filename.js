const urlFilename = (url) => {
  return url.split("/").at(-1);
};

module.exports = urlFilename;
