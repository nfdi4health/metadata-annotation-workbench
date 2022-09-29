import React from "react";

import {
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiIcon,
} from "@elastic/eui";
import { Helmet } from "react-helmet";
import { EuiCustomHeaderLink } from "./util/EuiCustomLink";
import { ReactComponent as nfdi4healthlogo } from "./logos/nfdi4health_Favicon-32x32.svg";
import { useMatomo } from "@datapunt/matomo-tracker-react";

export default () => {
  const { enableLinkTracking } = useMatomo();

  enableLinkTracking();
  return (
    <EuiHeader
      position="fixed"
      style={{
        background: "#ffffff",
        borderTop: "2px solid #2DAADE",
        boxShadow: "0 6px 5px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <Helmet>
        <title>Metadata Annotation Workbench</title>
        <meta name="description" content="Metadata Annotation Workbench" />
      </Helmet>
      <EuiHeaderSection grow={false}>
        <EuiHeaderSectionItem border="right">
          <EuiCustomHeaderLink color="text" to="/" isActive={false}>
            <EuiIcon type={nfdi4healthlogo} size="xl" />
          </EuiCustomHeaderLink>
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem border="right">
          <EuiCustomHeaderLink to="/about">About</EuiCustomHeaderLink>
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem>
          <EuiCustomHeaderLink to="/tutorial">Tutorial</EuiCustomHeaderLink>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </EuiHeader>
  );
};
