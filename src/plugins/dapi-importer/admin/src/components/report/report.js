import React from "react";
import { Typography } from "@strapi/design-system/Typography";
import { Stack } from "@strapi/design-system/Stack";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import Section from "../section/section";

export default function Report({ report }) {
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
        <GridItem col={9} s={12}>
          <Stack size={4}>
            <Typography marginBottom={4} variant="delta">
              current url
            </Typography>
            <Typography marginBottom={4} variant="omega">
              {report.currentURL || "-"}
            </Typography>
          </Stack>
        </GridItem>
      </Grid>
    </Section>
  );
}
