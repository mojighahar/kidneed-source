const axios = require("axios");

const getResource = async (url, count = 0) => {
  if (count > 3) {
    throw new Error(`cant get resources from ${url}`);
  }
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    return await getResource(url, count + 1);
  }
};

module.exports = getResource;
