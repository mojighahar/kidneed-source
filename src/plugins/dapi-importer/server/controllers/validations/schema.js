"use strict";
const without = require("lodash/without");

module.exports = (schema) => {
  if (!schema) {
    throw new Error("Model not found");
  }

  const presentFields = [
    "title",
    "type",
    "description",
    "uuid",
    "meta",
    "suitableFor",
    "attachments",
    "source",
    "sourceUrl",
    "ageCategory",
    "srcFile",
  ];

  const absents = presentFields.filter((field) => !(field in schema));
  if (absents.length > 0) {
    throw new Error(
      `These fields missed from provided model: ${absents.join(", ")}`
    );
  }

  const fieldTypes = {
    title: "string",
    type: "enumeration",
    description: "text",
    uuid: "uid",
    meta: "json",
    suitableFor: "enumeration",
    attachments: "media",
    source: "string",
    sourceUrl: "string",
    ageCategory: "integer",
    srcFile: "string",
  };

  const mismatchedTypes = presentFields.filter(
    (field) => schema[field].type !== fieldTypes[field]
  );

  if (mismatchedTypes.length > 0) {
    const types = mismatchedTypes.map((field) => fieldTypes[field]);
    throw new Error(
      `Field Types doesn't match, change type of these fields: ${mismatchedTypes.join(
        ", "
      )} to ${types.join(", ")} respectively`
    );
  }

  if (!schema.title.pluginOptions?.i18n?.localized) {
    throw new Error("Title should support i18n");
  }

  const typeEnums = [
    "animation",
    "activity",
    "audio",
    "book",
    "game",
    "website",
    "video",
  ];

  const missingTypeEnums = without(typeEnums, ...schema.type.enum);

  if (missingTypeEnums.length > 0) {
    throw new Error(
      `Enumeration of type field should have following values: ${missingTypeEnums.join(
        ", "
      )}`
    );
  }

  const suitableForEnums = ["boy", "girl", "both"];

  const missingSuitableForEnums = without(
    suitableForEnums,
    ...schema.suitableFor.enum
  );

  if (missingTypeEnums.length > 0) {
    throw new Error(
      `Enumeration of suitableFor field should have following values: ${missingSuitableForEnums.join(
        ", "
      )}`
    );
  }

  return true;
};
