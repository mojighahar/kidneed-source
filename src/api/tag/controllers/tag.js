"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tag.tag", () => ({
  async find(ctx) {
    strapi.query("api::tag.tag").findMany();
  },
}));
