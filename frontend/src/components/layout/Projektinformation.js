import React from "react";
import {
  EuiAccordion,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiText,
} from "@elastic/eui";
import { EuiNavigationLink } from "./util/EuiCustomLink";

export default () => {
  return (
    <EuiAccordion
      id="accordion2"
      arrowDisplay="none"
      initialIsOpen={true}
      buttonContent={
        <>
          {" "}
          <EuiIcon type="iInCircle" /> {"  "}Information
        </>
      }
    >
      <EuiFlexGroup>
        <EuiFlexItem grow={9}>
          <EuiText>
            <p>
              The semantic metadata annotation service is developed in the{" "}
              <EuiLink href="https://www.nfdi4health.de/en/">
                NFDI4Health
              </EuiLink>{" "}
              project. The service aims to assist researchers with semantic
              annotation of data dictionaries, questionnaires or other data
              collection instruments. This software is currently in active
              development. Existing features are regularly updated and new
              features are added. For further information please see the{" "}
              <EuiNavigationLink to="/about">About Page</EuiNavigationLink> and
              the <EuiNavigationLink to="/tutorial">Tutorial</EuiNavigationLink>
              .
            </p>
          </EuiText>
        </EuiFlexItem>
        {/*<EuiFlexItem grow={false}>*/}
        {/*  <EuiLink target="_blank" href="https://www.nfdi4health.de/en/" external={false}>*/}
        {/*  <NFDI4HEALTHLOGO height="50px" />*/}
        {/*  </EuiLink>*/}
        {/*</EuiFlexItem>*/}
      </EuiFlexGroup>
    </EuiAccordion>
  );
};
