import React from "react";
import {
  EuiHeader,
  EuiLink,
  EuiPageBody,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Link } from "react-router-dom";

export default () => {
  const { trackPageView } = useMatomo();
  // Track page view
  React.useEffect(() => {
    trackPageView({});
  }, []);

  return (
    <>
      <EuiHeader />
      <EuiPanel hasShadow={true}>
        <EuiPageBody restrictWidth={true}>
          <EuiSpacer size="m" />
          <EuiTitle>
            <h1>
              Semantic Metadata Annotator for annotation of questionnaires, data
              dictionaries and case report forms
            </h1>
          </EuiTitle>
          <EuiSpacer size="m" />
          <EuiTitle>
            <h3>Background</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              The German project NFDI4Health is dedicated to the development of
              national research data infrastructure for personal health data,
              and as such searches for ways to enhance semantic
              interoperability. For more information see{" "}
              <EuiLink href="https://www.nfdi4health.de/en/">
                NFDI4Health.
              </EuiLink>{" "}
            </EuiText>
          </p>
          <EuiSpacer size="m" />
          <EuiTitle>
            <h3>Goal</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              Interoperability of data dictionaries, questionnaires and data
              collection tools is key to reusing and combining results from
              independent research studies. This can be reached by integration
              of semantic codes into study metadata.
            </EuiText>
          </p>
          <EuiSpacer size="m" />
          <EuiTitle>
            <h3>Challenge</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              The researcher is confronted with terminologies and ontologies and
              plenty of variables to annotate in standard and non-standard
              formats. Terminologies, ontologies and standard formats differ
              depending on the domain. Thus, the process of semantic metadata
              annotation is labor intensive.
            </EuiText>
          </p>
          <EuiSpacer size="m" />
          <EuiTitle>
            <h3>Service</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              This annotation service is intended to help with the semantic
              enrichment by integration of semantic codes into study metadata.
              The tool provides relevant terminologies and ontologies and
              semi-automated annotation support to support the creation of
              interoperable version of the data collection instruments.
            </EuiText>
          </p>
          <EuiSpacer />

          <EuiSpacer size="m" />
          <p>
            <EuiText>
              For further information please see our{" "}
              <Link to="/tutorial">tutorial</Link>.
            </EuiText>
          </p>
        </EuiPageBody>
      </EuiPanel>
    </>
  );
};
