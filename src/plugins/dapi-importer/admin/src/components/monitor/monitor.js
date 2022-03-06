import React from "react";
import { Typography } from "@strapi/design-system/Typography";
import { Stack } from "@strapi/design-system/Stack";
import Section from "../section/section";

export default function Logs({ logs }) {
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
              {logs.map((log) => (
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
}
