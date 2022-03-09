module.exports = {
  routes: [
    {
      method: "GET",
      path: "/videos",
      handler: "video-controller.index",
    },
    {
      method: "POST",
      path: "/videos/publish",
      handler: "video-controller.publishVideo",
    },
  ],
};
