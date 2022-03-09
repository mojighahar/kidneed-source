module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        endpoint: env("AWS_ENDPOINT"),
        params: {
          Bucket: env("AWS_BUCKET"),
        },
      },
    },
  },
  "dapi-importer": {
    enabled: false,
    resolve: "./src/plugins/dapi-importer",
  },
  "bulk-publisher": {
    enabled: false,
    resolve: "./src/plugins/bulk-publisher",
  },
});
