"use strict";
module.exports = {
  async index(ctx) {
    const videos = await strapi.query("api::content.content").findMany({
      where: { type: "video", publishedAt: { $not: null } },
      select: ["id", "uuid", "title", "meta"],
    });

    const result = videos.map((v) => {
      const duration = v.meta?.duration;

      return {
        id: v.id,
        uuid: v.uuid,
        title: v.title,
        duration,
      };
    });

    return { result };
  },
};
