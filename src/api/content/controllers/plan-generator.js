"use strict";

const contentTypes = {
  0: "book",
  1: "game",
  2: "audio",
};

const fetchData = async (type, limit) => {
  return await strapi.query("api::content.content").findMany({
    where: { type },
    select: ["id"],
    limit,
  });
};

module.exports = {
  async generate(ctx) {
    const daysCount = parseInt(ctx.request.query.daysCount) || 30;
    const contents = {
      video: await fetchData("video", daysCount * 2),
      activity: await fetchData("activity", daysCount * 2),
      book: await fetchData("book", Math.floor((daysCount * 2) / 3)),
      audio: await fetchData("audio", Math.floor((daysCount * 2) / 3)),
      game: await fetchData("game", Math.floor((daysCount * 2) / 3)),
    };

    const plan = [];
    for (let i = 0; i < daysCount; i++) {
      plan.push({
        dayIndex: i,
        contents: [
          {
            type: "video",
            duration: 1000,
            content1Id: contents.video[i * 2].id,
            content2Id: contents.video[i * 2 + 1].id,
          },
          {
            type: "activity",
            duration: 1000,
            content1Id: contents.activity[i * 2].id,
            content2Id: contents.activity[i * 2 + 1].id,
          },
          {
            type: contentTypes[i % 3],
            duration: 1000,
            content1Id: contents[contentTypes[i % 3]][Math.floor(i / 3) * 2].id,
            content2Id:
              contents[contentTypes[i % 3]][Math.floor(i / 3) * 2 + 1].id,
          },
        ],
      });
    }

    return plan;
  },
};
