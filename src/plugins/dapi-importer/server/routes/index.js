module.exports = [
  {
    method: "POST",
    path: "/import",
    handler: "dapiController.import",
    config: {
      policies: [],
    },
  },
  {
    method: "GET",
    path: "/report",
    handler: "dapiController.report",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/stop",
    handler: "dapiController.stop",
    config: {
      policies: [],
    },
  },
  {
    method: "POST",
    path: "/reset",
    handler: "dapiController.reset",
    config: {
      policies: [],
    },
  },
];
