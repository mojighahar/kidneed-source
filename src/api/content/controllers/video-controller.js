"use strict";
module.exports = {
  async index(ctx) {
    const videos = await strapi.query("api::content.content").findMany({
      where: { type: "video", publishedAt: { $not: null } },
      select: ["id", "uuid", "title", "meta", "ageCategory"],
      sort: ['ageCategory:desc'],
    });

    const result = videos.map((v) => {
      const duration = v.meta?.duration;

      return {
        id: v.id,
        uuid: v.uuid,
        title: v.title,
        ageCategory: v.ageCategory,
        meta: v.meta,
        duration,
      };
    });

    return { result };
  },
  async publishVideo(ctx) {
    const { aliases, maxDuration, minDuration, count, ageCategory } =
      ctx.request.body;

    let videos = await strapi.query("api::content.content").findMany({
      where: { type: "video", ageCategory },
      select: ["id", "meta"],
    });

    videos = videos.filter((video) => {
      const alias = video.meta?.alias?.slice(1);
      const duration = video.meta?.duration;

      if (alias === null || duration === null) {
        return false;
      }

      return (
        aliases.includes(alias) &&
        duration >= minDuration &&
        duration <= maxDuration
      );
    });

    for (let i = 0; i < Math.min(count, videos.length); i++) {
      const { id } = videos[i];

      await strapi.service("api::content.content").update(id, {
        data: { publishedAt: new Date() },
      });
    }

    return { published: Math.min(count, videos.length) };
  },
};
