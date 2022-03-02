const validateModelUID = require("./validations/validate-model");
const modelUID = require("../utils/model-uid");

const createImportController = (importer, run) => ({
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

  async reset(ctx) {
    importer.reset();
    ctx.body = importer.get();
  },
});

module.exports = createImportController;
