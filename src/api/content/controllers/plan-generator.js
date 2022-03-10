"use strict";

const contentTypes = {
  0: "book",
  1: "audio",
  2: "game",
};

const fetchData = async (type, limit, where) => {
  where = where || {};
  return await strapi.query("api::content.content").findMany({
    where: { type, ...where },
    select: ["id", "meta"],
    limit,
  });
};

module.exports = {
  async generate(ctx) {
    const daysCount = parseInt(ctx.request.query.daysCount) || 30;
    const age = parseInt(ctx.request.query.age) || 3;
    const contents = {
      video: await fetchData("video", daysCount * 2),
      activity: await fetchData("activity", daysCount * 2),
      book: await fetchData("book", Math.max(Math.floor(daysCount / 3), 1) * 2, {
        ageCategory: age,
      }),
      audio: await fetchData("audio", Math.max(Math.floor(daysCount / 3), 1) * 2),
      game: await fetchData("game", Math.max(Math.floor(daysCount / 3), 1) * 2, {
        ageCategory: age,
      }),
    };

    const plan = [];
    for (let i = 0; i < daysCount; i++) {
      const contentType = contentTypes[i % 3];
      plan.push({
        dayIndex: i,
        contents: [
          {
            type: "video",
            duration: contents.video[i * 2].meta?.duration,
            content1Id: contents.video[i * 2].id,
            content2Id: contents.video[i * 2 + 1].id,
          },
          {
            type: "activity",
            duration: 0,
            content1Id: contents.activity[i * 2]?.id,
            content2Id: contents.activity[i * 2 + 1]?.id,
          },
          {
            type: contentType,
            duration:
              contentType == "audio"
                ? contents[contentType][
                    Math.floor(i / 3) * 2
                  ]?.meta?.chapters?.reduce(
                    (sum, item) => sum + item?.duration,
                    0
                  )
                : 0,
            content1Id: contents[contentType][Math.floor(i / 3) * 2]?.id,
            content2Id: contents[contentType][Math.floor(i / 3) * 2 + 1]?.id,
          },
        ],
      });
    }

    return plan;
  },
};
