"use strict";

const utils = require("@strapi/utils");
const modelUID = require("../utils/model-uid");
const { ValidationError } = utils.errors;

const updateModelsState = async (ctx, publish = true) => {
  const { model, where } = ctx.request.body;
  if (!model) {
    throw new ValidationError(`Model Cannot be empty ${model}`);
  }

  const uid = modelUID(model);
  if (!strapi.query(uid)) {
    throw new ValidationError(`Model not found ${model}`);
  }

  const contents = await strapi.query(uid).findMany({ where, select: ["id"] });

  for (let i = 0; i < contents.length; i++) {
    await updateModelState(uid, contents[i].id, publish);
  }

  return contents.length;
};

const updateModelState = async (uid, id, publish = true) => {
  await strapi
    .service(uid)
    .update(id, { data: { publishedAt: publish ? new Date() : null } });
};

module.exports = {
  async publish(ctx) {
    const count = await updateModelsState(ctx);
    return { ok: true, count };
  },
  async unpublish(ctx) {
    const count = await updateModelsState(ctx, false);
    return { ok: true, count };
  },
};
