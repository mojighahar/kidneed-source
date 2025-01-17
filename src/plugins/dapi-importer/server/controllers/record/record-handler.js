"use strict";

const fs = require("fs");
const getResource = require("../../utils/get-resource");
const downloadResource = require("../../utils/download-resource");

const find = async (record, uid) => {
  const result = await strapi
    .query(uid)
    .findMany({ where: { uuid: record.uuid }, populate: ["attachments"] });

  return result.length > 0 ? result[0] : null;
};

const persist = async (record, uid, importer) => {
  const params = {
    data: {
      uuid: record.uuid,
      title: record.title_fa,
      suitableFor: "both",
      type: record.content_type.toLowerCase(),
      ageCategory: record.age_category,
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

const syncPublish = async (record, uid, id) => {
  await strapi.service(uid).update(id, {
    data: { publishedAt: record.event_available ? new Date() : null },
  });
};

const create = async (record, uid, importer) => {
  importer.log("processing", record.uuid);

  const found = await find(record, uid);

  if (found) {
    if (!!found.publishedAt !== !!record.event_available) {
      await syncPublish(record, uid, found.id);
      importer.log("synced publish", record.uuid);
    }

    importer.log("already exists", record.uuid);
    return;
  }

  await persist(record, uid, importer);
};

const download = async (record, uid, importer) => {
  const url = record.src_file;
  if (!url) {
    return;
  }

  const found = await find(record, uid);

  if (!found) {
    importer.log("resource not found", record.uuid, "error");
    return;
  }

  if (
    found.attachments &&
    found.attachments.some((attachment) => url.includes(attachment.name))
  ) {
    importer.log("resource already downloaded", url);
    return;
  }

  let resource;
  try {
    importer.log("downloading", url);
    resource = await downloadResource(url);
  } catch (e) {
    importer.log("download failed", `${url}(${e.message})`, "error");
    return;
  }

  importer.log("downloaded", url);
  if (!resource) {
    return;
  }

  try {
    await strapi
      .service(uid)
      .update(found.id, { files: { attachments: [resource] } });
    importer.persisted(record.uuid);
  } catch (e) {
    importer.log("Error", `cannot update ${record.uuid}`, "error");
  }

  await fs.unlink(resource.path, () => importer.log("clean", resource.path));
};

const loopRecords = async (uid, importer, handler) => {
  try {
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
  } catch (e) {
    importer.log("ERROR", e.message, "error");
    importer.stop();
  }
};

module.exports = {
  loopRecords,
  find,
  create,
  download,
};
