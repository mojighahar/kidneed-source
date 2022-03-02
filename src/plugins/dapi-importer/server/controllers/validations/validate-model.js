const validateSchema = require("./schema");

const validateModelUID = (uid) => {
  validateSchema(strapi.getModel(uid)?.attributes);

  if (!strapi.service(uid)) {
    throw new Error("Related Service could not be found");
  }

  if (!strapi.query(uid)) {
    throw new Error("Related Query could not be found");
  }
};

module.exports = validateModelUID;
