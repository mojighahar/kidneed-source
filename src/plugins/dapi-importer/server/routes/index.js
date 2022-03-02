const baseRoute = (prefix, controller) => [
  {
    method: `POST`,
    path: `/${prefix}/start`,
    handler: `${controller}.import`,
  },
  {
    method: `GET`,
    path: `/${prefix}/report`,
    handler: `${controller}.report`,
  },
  {
    method: `POST`,
    path: `/${prefix}/stop`,
    handler: `${controller}.stop`,
  },
  {
    method: `POST`,
    path: `/${prefix}/reset`,
    handler: `${controller}.reset`,
  },
];

module.exports = [
  ...baseRoute("import", "importController"),
  ...baseRoute("download", "downloadController"),
];
