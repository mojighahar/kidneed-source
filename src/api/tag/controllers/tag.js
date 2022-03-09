"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tag.tag", ({ strapi }) => ({
  async find(ctx) {
    const data = await strapi.query("api::tag.tag").findMany();

    return { data };
  }
}));
