import React from "react";
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiLink,
  EuiSpacer,
  EuiText,
} from "@elastic/eui";
import { ReactComponent as DFGLOGO } from "./logos/dfg_logo_schriftzug_blau_foerderung_en.svg";
import { ReactComponent as NFDI4HEALTHLOGO } from "./logos/NFDI4Health_Logo_cmyk_RZ.svg";
import { ReactComponent as ZBMEDLOGO } from "./logos/ZBMED_2017_DE.svg";
import { EuiNavigationLink } from "./util/EuiCustomLink";
import { useQuery } from "react-query";
import moment from "moment";

export default () => {
  const { data } = useQuery("stats", () => {
    // eslint-disable-next-line no-undef
    return fetch("/api/stats/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        return json;
      });
  });
  return (
    <div>
      <EuiSpacer size-="xl" />
      <EuiHorizontalRule size="half" />
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={true}></EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText color="subdued" size="s">
            {/*<EuiLink href="mailto:fb.studyhub@nfdi4health.de">Contact</EuiLink> |{" "}*/}
            <EuiNavigationLink to="/about">About</EuiNavigationLink> |{" "}
            <EuiNavigationLink to="/imprint">Legal Notice</EuiNavigationLink> |{" "}
            <EuiNavigationLink to="/privacy">
              Privacy Declaration
            </EuiNavigationLink>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={true}></EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={true}></EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText color="subdued" size="xs">
            Version: {data ? data.softwareVersion : ""}
            <p></p>
            Last Update: {data ? moment(data.lastUpdate).format("LLL") : ""}
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={true}></EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup justifyContent="spaceAround" gutterSize="xl">
        <EuiFlexItem grow={true}></EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink target="_blank" href="https://www.dfg.de/" external={false}>
            <DFGLOGO width="auto" height="100px" />
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink
            target="_blank"
            href="https://www.nfdi4health.de/en/"
            external={false}
          >
            <NFDI4HEALTHLOGO width="auto" height="100px" />
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink target="_blank" href="https://zbmed.de" external={false}>
            <ZBMEDLOGO width="auto" height="100px" />
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem grow={true}></EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size-="xl" />
      <EuiFlexGroup justifyContent="spaceAround" gutterSize="xl">
        <EuiFlexItem grow={false}>
          <EuiText color="subdued" size="s">
            This service is developed in the project NFDI4Health. NFDI4Health is
            one of the funded consortia of the National Research Data
            Infrastructure programme of the DFG. (Project identifier 442326535).
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size-="xl" />
    </div>
  );
};
