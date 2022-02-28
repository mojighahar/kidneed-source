const axios = require("axios");

const getResource = async (url) => {
  const response = await axios.get(url);

  return response.data;
};

module.exports = getResource;
