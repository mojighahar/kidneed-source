module.exports = [
  {
    method: "POST",
    path: "/publish",
    handler: "publisherController.publish",
  },
  {
    method: "POST",
    path: "/unpublish",
    handler: "publisherController.unpublish",
  },
];
