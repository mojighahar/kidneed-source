// jshint ignore: start

import React, { memo } from "react";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import pluginId from "../../pluginId";
import { Box } from "@strapi/design-system/Box";
import { Layout } from "@strapi/design-system/Layout";
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
} from "@strapi/design-system/SubNav";
import Download from "../download/download";
import ImportResource from "../import-resource/import-resource";

const links = [
  {
    id: 1,
    label: "Data",
    to: `/plugins/${pluginId}/data`,
    active: true,
  },
  {
    id: 2,
    label: "Files",
    to: `/plugins/${pluginId}/files`,
  },
];

const Navigation = () => {
  return (
    <SubNav ariaLabel="Builder sub nav">
      <SubNavHeader label="Importer" />
      <SubNavSections>
        <SubNavSection
          label="Import Type"
          collapsable
          badgeLabel={links.length.toString()}
        >
          {links.map((link) => (
            <SubNavLink to={link.to} active={link.active} key={link.id}>
              {link.label}
            </SubNavLink>
          ))}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
};

const HomePage = () => {
  let { path } = useRouteMatch();

  return (
    <Box background="neutral100">
      <Layout sideNav={<Navigation />}>
        <Switch>
          <Route path={`${path}/data`} component={ImportResource} exact />
          <Route path={`${path}/files`} component={Download} exact />
          <Redirect to={`${path}/data`} />
        </Switch>
      </Layout>
    </Box>
  );
};

export default memo(HomePage);
