import React, { memo, useState, useEffect } from "react";
import { Box } from "@strapi/design-system/Box";

import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { TextInput } from "@strapi/design-system/TextInput";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { Alert } from "@strapi/design-system/Alert";
import { request } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

const HomePage = () => {
  const [model, setModel] = useState();
  const [loading, setLoading] = useState(false);
  const [json, setJson] = useState();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function call(type) {
    return async function () {
      setLoading(true);
      setSuccess(null);
      try {
        const report = await request(`/${pluginId}/${type}`, {
          method: `POST`,
          body: { model, where: json },
        });
        setSuccess(`${report.count} ${type}`);
      } catch (e) {
        setError(e.response?.payload?.error?.message || e.message);
      }
      setLoading(false);
    };
  }

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Bulk Publisher"
          subtitle="You can publish or unpublish models here in bulk"
          as="h2"
        />
      </Box>
      <Box marginBottom={6} paddingLeft={10} paddingRight={10}>
        <Box
          background="neutral0"
          padding={6}
          hasRadius
          shadow="tableShadow"
          hiddenXS
          borderWidth="2px"
        >
          <Grid alignItems="end" gap={5} gridCols={12} marginBottom={4}>
            <GridItem col={6} s={12}>
              <TextInput
                placeholder="This is a content placeholder"
                label="Content Type Name"
                name="model"
                hint="please fill the input with your related model to dapi"
                onChange={(e) => setModel(e.target.value)}
                value={model}
              />
            </GridItem>
            <GridItem col={7} s={12}>
              <Editor value={{}} onChange={(j) => setJson(j)} />
            </GridItem>

            <GridItem col={7} s={12}>
              <Stack size={4} horizontal>
                <Button
                  disabled={loading || !model}
                  loading={loading}
                  size="S"
                  onClick={call("publish")}
                >
                  publish
                </Button>
                <Button
                  disabled={loading || !model}
                  loading={loading}
                  size="S"
                  onClick={call("unpublish")}
                >
                  unpublish
                </Button>
              </Stack>
            </GridItem>
          </Grid>
          {error && (
            <Alert
              variant="danger"
              closeLabel="Close Error"
              title="Error"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              variant="success"
              closeLabel="Close Notificaiton"
              title="Notification"
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default memo(HomePage);
