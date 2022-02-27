"use strict";

const axios = require("axios");
const validateSchema = require("./validations/schema");
const download = require("../utils/download");
const path = require("path");
const os = require("os");
const fs = require("fs");
const mime = require("mime-types");

let status = {
  running: false,
  processed: 0,
  saved: 0,
  currentPage: "https://dapi.kidneed.ir/dev/content/?format=json",
  lastRun: null,
  description: [],
};

const updateStatusDescription = (description) => {
  console.log(description);
  status.description.push(description);
};

const filename = (url) => {
  return url.split("/").at(-1);
};

const run = (contentService, contentQuery) => {
  if (status.running) {
    return;
  }

  status = {
    ...status,
    running: true,
    lastRun: new Date(),
  };
  processRecords(contentService, contentQuery);
};

const stop = () => {
  status = {
    ...status,
    running: false,
  };
};

const getRecords = async (url) => {
  const response = await axios.get(url);

  return response.data;
};

const fileData = async (url) => {
  if (!url) {
    return;
  }

  const dest = tempFilePath(url);
  updateStatusDescription(`downloading ${url}`);

  try {
    await download(url, dest);
  } catch (e) {
    updateStatusDescription(`error happened while downloading: ${e.message}`);
    return null;
  }

  const stats = fs.statSync(dest);
  updateStatusDescription(`downloaded ${url}`);

  return {
    path: dest,
    name: filename(url),
    size: stats.size,
    type: mime.lookup(dest),
  };
};

const findRecord = async (contentQuery, uuid) => {
  const result = await contentQuery.findMany({ where: { uuid } });

  return result.length > 0;
};

const saveRecord = async (record, contentService, contentQuery) => {
  updateStatusDescription(`process ${record.uuid} record`);

  if (await findRecord(contentQuery, record.uuid)) {
    updateStatusDescription(`repeated ${record.uuid} record`);
    return;
  }

  const downloadedFile = await fileData(record.src_file);
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

  if (downloadedFile) {
    params["files"] = [downloadedFile];
  }

  await contentService.create(params);

  status.saved += 1;
  updateStatusDescription(`saved ${record.uuid} record`);
  if (downloadedFile) {
    await fs.unlink(downloadedFile.path, () =>
      updateStatusDescription(`removed ${downloadedFile.path} from tmp`)
    );
  }
};

const processRecords = async (contentService, contentQuery) => {
  const response = await getRecords(status.currentPage);

  const { results } = response;

  if (results && Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      await saveRecord(results[i], contentService, contentQuery);
      status.processed += 1;
    }
  }

  if (response.next) {
    status.currentPage = response.next;
    status.running && processRecords();
  }
};

const normalizeModel = (model) => {
  if (!model) {
    throw new Error("Content type model cannot be empty");
  }

  if (model.split("::").length > 1) {
    return model;
  }

  if (model.split(".").length > 1) {
    return `api::${model}`;
  }

  return `api::${model}.${model}`;
};

const getContentService = (modelId) => {
  const contentService = strapi.service(modelId);

  if (!contentService) {
    throw new Error("Related Service could not be found");
  }

  return contentService;
};

const getContentQuery = (modelId) => {
  const contentService = strapi.query(modelId);

  if (!contentService) {
    throw new Error("Related Service could not be found");
  }

  return contentService;
};

const tempFilePath = (url) => path.join(os.tmpdir(), filename(url));

module.exports = {
  async import(ctx) {
    try {
      const { model } = ctx.request.body;

      const modelId = normalizeModel(model);

      validateSchema(strapi.getModel(modelId)?.attributes);

      const contentService = getContentService(modelId);
      const contentQuery = getContentQuery(modelId);
      const r = await contentQuery.findMany({
        where: {
          uuid: "0002ee54-2300-4019-8c32-8335f527f54d",
        },
      });

      run(contentService, contentQuery);

      ctx.body = { ...status };
    } catch (e) {
      ctx.badRequest(e.message);
    }
  },
  async report(ctx) {
    ctx.body = { ...status };
    status.description = status.description.slice(-10);
  },
  async stop(ctx) {
    stop();
    ctx.body = { ...status };
  },
};
