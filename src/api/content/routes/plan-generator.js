module.exports = {
  routes: [
    {
      method: "GET",
      path: "/plan-generator",
      handler: "plan-generator.generate",
      config: {
        auth: false
      }
    },
  ],
};
