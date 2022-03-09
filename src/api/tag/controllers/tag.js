"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tag.tag", ({ strapi }) => ({
  async find(ctx) {
    strapi.db.query("api::tag.tag").find();
  },
}));
