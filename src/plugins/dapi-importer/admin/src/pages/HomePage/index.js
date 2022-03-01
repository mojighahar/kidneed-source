// jshint ignore: start

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { Box } from "@strapi/design-system/Box";

import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { Typography } from "@strapi/design-system/Typography";
import { TextInput } from "@strapi/design-system/TextInput";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import Section from "../../components/section/section";

import { Alert } from "@strapi/design-system/Alert";
import useImport from "../../hooks/use-import";

const HomePage = () => {
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
  } = useImport();

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

  const Report = () => {
    if (!report) {
      return null;
    }

    let title = "Report - Not Running";
    if (report.running) {
      title = "Report - Running";
    }
    if (report.finishedAt) {
      title = "Report - Finished";
    }

    return (
      <Section title={title}>
        <Grid alignItems="end" gap={5} gridCols={12}>
          <GridItem col={3} s={12}>
            <Stack size={4}>
              <Typography marginBottom={4} variant="delta">
                Total
              </Typography>
              <Typography marginBottom={4} variant="omega">
                {report.total || "NA"}
              </Typography>
            </Stack>
          </GridItem>
          <GridItem col={3} s={12}>
            <Stack size={4}>
              <Typography marginBottom={4} variant="delta">
                Processed
              </Typography>
              <Typography marginBottom={4} variant="omega">
                {report.processed}
              </Typography>
            </Stack>
          </GridItem>
          <GridItem col={3} s={12}>
            <Stack size={4}>
              <Typography marginBottom={4} variant="delta">
                Persisted
              </Typography>
              <Typography marginBottom={4} variant="omega">
                {report.persisted}
              </Typography>
            </Stack>
          </GridItem>
          <GridItem col={3} s={12}>
            <Stack size={4}>
              <Typography marginBottom={4} variant="delta">
                Progress
              </Typography>
              <Typography marginBottom={4} variant="omega">
                {report.total > 0
                  ? Math.floor((report.processed * 100) / report.total)
                  : "-"}
                %
              </Typography>
            </Stack>
          </GridItem>
          <GridItem col={3} s={12}>
            <Stack size={4}>
              <Typography marginBottom={4} variant="delta">
                Last run
              </Typography>
              <Typography marginBottom={4} variant="omega">
                {report.lastRun || "-"}
              </Typography>
            </Stack>
          </GridItem>
        </Grid>
      </Section>
    );
  };

  const Logs = () => {
    if (!report) {
      return null;
    }

    return (
      <Section title="Logs">
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            maxHeight: "200px",
            overflowY: "scroll",
          }}
        >
          <Stack size={4} maxHeight={200}>
            <ul>
              {showLog.map((log) => (
                <li key={log.uuid}>
                  <Typography
                    textColor={
                      log.type === "error" ? "danger500" : "neutral900"
                    }
                    variant="omega"
                  >
                    {log.title}:{log.body}
                  </Typography>
                </li>
              ))}
            </ul>
          </Stack>
        </div>
      </Section>
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
      <Section title="Import Records">
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
      <Report />
      <Logs />
    </>
  );
};

export default memo(HomePage);
