function modelUID(model) {
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
}

module.exports = modelUID;
