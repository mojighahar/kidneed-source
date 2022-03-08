module.exports = {
  routes: [
    {
      method: "GET",
      path: "/videos",
      handler: "video-controller.index",
    },
  ],
};
