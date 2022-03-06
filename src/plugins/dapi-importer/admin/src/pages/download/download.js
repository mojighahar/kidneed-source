// jshint ignore: start

import React, { memo, useState, useEffect } from "react";
import { Box } from "@strapi/design-system/Box";

import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { TextInput } from "@strapi/design-system/TextInput";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import Section from "../../components/section/section";
import Logs from "../../components/monitor/monitor";
import Report from "../../components/report/report";

import { Alert } from "@strapi/design-system/Alert";
import useImport from "../../hooks/use-import";

const Download = () => {
  const [model, setModel] = useState("");
  const [logPool, setLogPool] = useState([]);
  const [showLog, setShowLog] = useState([]);
  const {
    loading,
    error,
    report,
    startImport,
    stopImport,
    resetImport,
    clearError,
  } = useImport("download");

  useEffect(() => {
    if (report?.uid) {
      setModel(report.uid);
    }

    if (report?.logs.length > 0) {
      fillLogPool(report.logs);
    }
  }, [report]);

  useEffect(() => {
    const id = setInterval(() => {
      if (logPool.length < 1) {
        return;
      }

      let count = Math.floor(logPool.length / 10) || 1;
      if (!report.running) {
        count = logPool.length;
      }

      const newLogs = logPool.slice(0, count);
      setLogPool(logPool.slice(count));
      setShowLog([...showLog.slice(-200), ...newLogs]);
    }, 200);

    return () => clearInterval(id);
  }, [logPool, report]);

  function fillLogPool(logs) {
    setLogPool([...logPool, ...logs]);
  }

  console.log(showLog.map((l) => l.uuid));

  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Dapi Downloader"
          subtitle="You can download records files from Dapi api"
          as="h2"
        />
      </Box>
      <Section title="Download Files">
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
                disabled={model.length < 3 || loading || report?.running}
                size="S"
                loading={loading}
                onClick={() => startImport(model)}
              >
                {report?.uid ? "Continue" : "Start"}
              </Button>
              <Button
                disabled={loading || !report?.running}
                size="S"
                loading={loading}
                onClick={stopImport}
              >
                Stop
              </Button>
              {report?.uid && (
                <Button
                  disabled={loading}
                  size="S"
                  loading={loading}
                  onClick={resetImport}
                >
                  Reset
                </Button>
              )}
            </Stack>
          </GridItem>
        </Grid>
        {error && (
          <Alert
            variant="danger"
            closeLabel="Close Error"
            title="Error"
            onClose={clearError}
          >
            {error}
          </Alert>
        )}
      </Section>
      {report && <Report report={report} />}
      {report && <Logs logs={showLog} />}
    </>
  );
};

export default memo(Download);
