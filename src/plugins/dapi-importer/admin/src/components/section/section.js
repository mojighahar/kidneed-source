import React from "react";
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { Stack } from "@strapi/design-system/Stack";

export default function Section({ title, children }) {
  return (
    <Box marginBottom={6} paddingLeft={10} paddingRight={10}>
      <Box
        background="neutral0"
        padding={6}
        hasRadius
        shadow="tableShadow"
        hiddenXS
        borderWidth="2px"
      >
        <Stack size={4}>
          <Typography marginBottom={4} variant="beta">
            {title}
          </Typography>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
