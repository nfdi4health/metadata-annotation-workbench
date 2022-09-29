import React from "react";
import {
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPanel,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import { Helmet } from "react-helmet";
import { useMatomo } from "@datapunt/matomo-tracker-react";

export default () => {
  const { trackPageView } = useMatomo();
  // Track page view
  React.useEffect(() => {
    trackPageView({});
  }, []);

  return (
    <>
      <Helmet>
        <title> Imprint - Metadata Annotation Workbench </title>
        <meta name="description" content="Metadata Annotation Workbench" />
      </Helmet>
      <EuiPanel hasShadow={true}>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle>
              <h1>Impressum</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageBody>
          <EuiTitle size="s">
            <h2>
              <b>Impressum</b>
            </h2>
          </EuiTitle>
          <EuiText>
            <p>
              <br></br>
              Deutsche Zentralbibliothek für Medizin (ZB MED) -
              Informationszentrum Lebenswissenschaften <br></br>
              Gleueler Straße 60<br></br>
              50931 Köln<br></br>
              Tel.: <a href="tel:+49 221 478-5685">+49 (0)221 478-5685</a>{" "}
              (Infocenter)<br></br>
              Email: <a href="mailto:info@zbmed.de">info@zbmed.de</a>
              <br></br>
              Stiftung des öffentlichen Rechts<br></br>
              Gefördert durch das Ministerium für Kultur und Wissenschaft des
              Landes Nordrhein-Westfalen und durch das Bundesministerium für
              Gesundheit aufgrund eines Beschlusses des Deutschen Bundestages.{" "}
            </p>
            <p>
              <b>Vertretungsberechtigte Personen:</b>
              <br></br>
              Kaufmännische Geschäftsführerin:{" "}
              <a href="mailto:Herrmann-Krotz@zbmed.de">
                Gabriele Herrmann-Krotz
              </a>
              , Diplom-Volkswirtin<br></br>
              Wissenschaftliche Leitung:{" "}
              <a href="mailto:Rebholz-Schuhmann@zbmed.de">
                Prof. Dr. Dietrich Rebholz-Schuhmann
              </a>
              <br></br>
              Umsatzsteuer-Identifikationsnummer: DE123486783{" "}
            </p>
            <p>
              <b>Zuständige Aufsichtsbehörde:</b>
              <br></br>
              Ministerium für Kultur und Wissenschaft des Landes
              Nordrhein-Westfalen - MKW NRW<br></br>
              Völklinger Straße 49<br></br>
              40221 Düsseldorf<br></br>
              Tel.: <a href="tel:+49 211 896 03">+49 (0)211 896-03</a> /{" "}
              <a href="tel:+49 211 896 04">-04</a>
              <br></br>
              Fax: <a href="fax:+49 211 896 455 5">
                +49 (0)211 896-4555
              </a> und <a href="fax:+49 211 896 322 0">-3220</a>{" "}
            </p>
          </EuiText>
        </EuiPageBody>
      </EuiPanel>
    </>
  );
};
