"use strict";

const fs = require("fs");
const getResource = require("../../utils/get-resource");
const downloadResource = require("../../utils/download-resource");

const find = async (record, uid) => {
  const result = await strapi
    .query(uid)
    .findMany({ where: { uuid: record.uuid } });

  return result.length > 0 ? result[0] : null;
};

const persist = async (record, uid, importer) => {
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
      srcFile: record.src_file,
      publishedAt: record.event_available ? new Date() : null,
    },
  };

  await strapi.service(uid).create(params);
  importer.persisted(record.uuid);
};

const create = async (record, uid, importer) => {
  importer.log("processing", record.uuid);

  const found = await find(record, uid);

  if (found) {
    importer.log("already exists", record.uuid);
    return;
  }

  await persist(record, uid, importer);
};

const download = async (uid, record, importer) => {
  if (!record.src_file) {
    return;
  }

  const found = await find(record, uid);

  importer.log("downloading", url);
  if (!found) {
    importer.log("resource not found", record.uuid, "error");
    return;
  }

  let resource;
  try {
    resource = await downloadResource(url);
  } catch (e) {
    importer.log("download failed", `${url}(${e.message})`, "error");
    return;
  }

  importer.log("downloaded", url);
  if (!resource) {
    return;
  }

  await strapi.service(uid).update({ files: [resource] }, record.id);
  importer.persisted(record.uuid);

  await fs.unlink(resource.path, () => importer.log("clean", resource.path));
};

const loopRecords = async (uid, importer, handler) => {
  const response = await getResource(importer.getURL());
  importer.setTotal(response.count);

  const { results } = response;

  if (results && Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      if (!importer.isRunning()) {
        return;
      }
      await handler(results[i], uid, importer);
      importer.processed(results[i].uuid);
    }
  }

  if (response.next) {
    importer.setURL(response.next);
    loopRecords(uid, importer, handler);
  } else {
    importer.finish();
  }
};

module.exports = {
  loopRecords,
  find,
  create,
  download,
};
