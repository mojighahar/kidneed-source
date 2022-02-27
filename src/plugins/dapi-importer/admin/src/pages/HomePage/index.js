/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
import axios from "axios";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { Box } from "@strapi/design-system/Box";
import { request } from "@strapi/helper-plugin";

import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { Typography } from "@strapi/design-system/Typography";
import { TextInput } from "@strapi/design-system/TextInput";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";

import { Alert } from "@strapi/design-system/Alert";

const HomePage = () => {
  const [model, setModel] = useState("");
  const [report, setReport] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getReport(first = false) {
    try {
      first && setLoading(true);
      const report = await request("/dapi-importer/report", {
        method: "GET",
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    first && setLoading(false);
  }

  async function stopImport() {
    try {
      setLoading(true);
      const report = await request("/dapi-importer/stop", {
        method: "POST",
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getReport();

    const id = setInterval(getReport, 5000);

    return () => clearInterval(id);
  }, []);

  async function importData() {
    try {
      setError(null);
      setLoading(true);
      const report = await request("/dapi-importer/import", {
        method: "POST",
        body: { model },
      });
      setReport(report);
    } catch (e) {
      setError(e.response?.payload?.error?.message || e.message);
    }
    setLoading(false);
  }

  function startImport() {
    importData();
  }

  const Report = () => {
    if (!report.running) {
      return null;
    }

    return (
      <Box
        background="neutral0"
        padding={6}
        hasRadius
        shadow="tableShadow"
        hiddenXS
        borderWidth="2px"
      >
        <Stack size={4}>
          {report.description.map((description) => (
            <Typography key={description} variant="omega">
              {description}
            </Typography>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Dapi Importer"
          subtitle="You can import records from Dpi api to your custom model here"
          as="h2"
        />
      </Box>

      <Box paddingLeft={10} paddingRight={10}>
        <Box
          background="neutral0"
          padding={6}
          hasRadius
          shadow="tableShadow"
          hiddenXS
          borderWidth="2px"
        >
          <Stack size={4}>
            <Typography marginBottom={4} variant="delta">
              Import Records
            </Typography>
            <Grid alignItems="end" gap={5} gridCols={12}>
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
                <Stack size={4} horizontal>
                  <Button
                    disabled={model.length < 3 || loading || report.running}
                    size="S"
                    loading={loading}
                    onClick={startImport}
                  >
                    Start
                  </Button>
                  <Button
                    disabled={loading || !report.running}
                    size="S"
                    loading={loading}
                    onClick={stopImport}
                  >
                    Stop
                  </Button>
                </Stack>
              </GridItem>
            </Grid>
            {error && (
              <Alert variant="danger" closeLabel="Close alert" title="Error">
                {error}
              </Alert>
            )}
            <Report />
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default memo(HomePage);
