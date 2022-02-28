"use strict";

const validateSchema = require("./validations/schema");
const fs = require("fs");
const modelUID = require("../utils/model-uid");
const Importer = require("../utils/importer");
const getResource = require("../utils/get-resource");
const downloadResource = require("../utils/download-resource");

const importer = Importer("https://dapi.kidneed.ir/dev/content/?format=json");

const run = (uid) => {
  importer.run(uid);
  processRecords(uid);
};

const fileInfo = async (url) => {
  if (!url) {
    return;
  }

  importer.log("downloading", url);

  try {
    const file = await downloadResource(url);
    importer.log("downloaded", url);
    return file;
  } catch (e) {
    importer.log("download failed", `${url}(${e.message})`, "error");
  }

  return null;
};

const findRecord = async (uid, record) => {
  const result = await strapi
    .query(uid)
    .findMany({ where: { uuid: record.uuid } });

  return result.length > 0 ? result[0] : null;
};

const persistRecord = async (uid, record) => {
  const resource = await fileInfo(record.src_file);
  const params = {
    data: {
      uuid: record.uuid,
      title: record.title_fa,
      suitableFor: "both",
      type: record.content_type.toLowerCase(),
      ageCategory: record.ageCategory,
      description: record.description,
      meta: record.metadata,
      source: record.source,
      sourceUrl: record.source_url,
      publishedAt: record.event_available ? new Date() : null,
    },
  };

  if (resource) {
    params.files = [resource];
  }

  await strapi.service(uid).create(params);
  importer.persisted(record.uuid);

  if (resource) {
    await fs.unlink(resource.path, () => importer.log("clean", resource.path));
  }
};

const processRecord = async (record, uid) => {
  importer.log("processing", record.uuid);

  const existedRecord = await findRecord(uid, record);

  if (existedRecord) {
    importer.log("already exists", record.uuid);
    return;
  }

  await persistRecord(uid, record);
};

const processRecords = async (uid) => {
  const response = await getResource(importer.getURL());
  importer.setTotal(response.count);

  const { results } = response;

  if (results && Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      if (!importer.isRunning()) {
        return;
      }
      await processRecord(results[i], uid);
      importer.processed(results[i].uuid);
    }
  }

  if (response.next) {
    importer.setURL(response.next);
    processRecords(uid);
  } else {
    importer.stop();
  }
};

const validateModelUID = (uid) => {
  validateSchema(strapi.getModel(uid)?.attributes);

  if (!strapi.service(uid)) {
    throw new Error("Related Service could not be found");
  }

  if (!strapi.query(uid)) {
    throw new Error("Related Query could not be found");
  }
};

module.exports = {
  async import(ctx) {
    try {
      const { model } = ctx.request.body;

      const uid = modelUID(model);
      validateModelUID(uid);

      run(uid);

      ctx.body = importer.get(true);
    } catch (e) {
      ctx.badRequest(e.message);
    }
  },

  async report(ctx) {
    ctx.body = importer.get(true);
  },

  async stop(ctx) {
    importer.stop();
    ctx.body = importer.get();
  },
};
