import React from "react";
import {
  EuiCallOut,
  EuiHeader,
  EuiImage,
  EuiLink,
  EuiPageBody,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from "@elastic/eui";
import eyeIcon from "../components/layout/images/EyeIcon.png";
import plusIcon from "../components/layout/images/PlusIcon.png";
import projectName from "../components/layout/images/ProjectName.png";
import importExcel from "../components/layout/images/ImportExcel.png";
import importQuestionnaire from "../components/layout/images/ImportQuestionnaire.png";
import TerminologySelection from "../components/layout/images/TerminologySelection.png";
import CurrentItem from "../components/layout/images/CurrentItem.png";
import ConceptSearch from "../components/layout/images/ConceptSearch.png";
import ConceptDetails from "../components/layout/images/ConceptDetails.png";
import Export from "../components/layout/images/Export.png";
import DataOverview from "../components/layout/images/DataOverview.png";
import { EuiNavigationLink } from "../components/layout/util/EuiCustomLink";
import { useMatomo } from "@datapunt/matomo-tracker-react";

export default () => {
  const { trackPageView } = useMatomo();

  // Track page view
  React.useEffect(() => {
    trackPageView();
  }, []);

  return (
    <>
      <EuiHeader />
      <EuiPanel hasShadow={true}>
        <EuiPageBody restrictWidth={true}>
          <EuiCallOut size="s" title="Under construction" iconType="alert">
            <p>
              The tutorial page refers to an older version of the software and
              needs to be updated. However, the basic functions are the same and
              this page can provide first guidance.
            </p>
          </EuiCallOut>

          <EuiTitle>
            <h1>Tutorial</h1>
          </EuiTitle>
          <EuiSpacer size="l" />
          <p>
            <EuiText>
              This software is currently in active development. Existing
              features are regularly updated and new features are added. Please
              forgive any errors that occur. Project information about this
              service can be found{" "}
              <EuiNavigationLink to="/about">here</EuiNavigationLink>.
            </EuiText>
          </p>
          <EuiSpacer size="l" />
          <EuiTitle>
            <h3>Import</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              1) Create a new project or select an existing project. Currently,
              a project consists of a single data set/file. The data is stored
              freely accessible in the database. With every update or software
              release, all data is lost, due to the prototype status of the
              tool. Make sure, to export your data if you want to keep it.
            </EuiText>
            <EuiSpacer size={"s"} />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={projectName}
              alt={"projectName"}
            />
          </p>
          <EuiSpacer size="m" />
          <p>
            <EuiText>2) Upload a data set.</EuiText>
            <EuiText>Currently two types of files can be uploaded:</EuiText>
            <EuiSpacer size={"s"} />
            <EuiText>
              <h5>Excel Spreadsheets</h5>
              <ul>
                <li>Select an Excel file</li>
                <li>Import the file</li>
                <li>Select the column for annotation</li>
              </ul>
            </EuiText>
            <EuiSpacer size={"s"} />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={importExcel}
              alt={"importExcel"}
            />
            <EuiSpacer size={"m"} />
            <EuiText>
              <h5>Long COVID Questionnaires</h5>
            </EuiText>
            <EuiSpacer size={"s"} />
            <EuiText>
              The COVID-19 Long term study questionnaire is a specific use case
              for the medical domain and helps developing this service. Two
              questionnaires for testing the service are already uploaded.
            </EuiText>
            <EuiSpacer size="s" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={importQuestionnaire}
              alt={"importQuestionnaire"}
            />
          </p>
          <EuiSpacer size={"m"} />
          <p>
            <EuiText>
              3) Select a or multiple terminologies for annotation. Currently
              all concept data will be retrieved from{" "}
              <EuiLink href="https://semanticlookup.zbmed.de/ols/index">
                SemLookP
              </EuiLink>{" "}
              .
            </EuiText>
            <EuiSpacer size="s" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={TerminologySelection}
              alt={"TerminologySelection"}
            />
          </p>

          <EuiSpacer size="l" />

          <EuiTitle>
            <h3>Annotation</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              The current item is displayed on top of the page. The item label
              or text and additional information e.g. the section for the
              questionnaire format can be seen on the left (1). The answer
              options of questions can be found next to it (2). On the top right
              side of the page, the annotations are listed (3). Multiple
              annotations can be added. With the buttons &quot;,Previous
              item&quot;, and &quot;,Next item&quot;,, you can run through the
              instrument data and add annotations item wise. The &quot;,Data
              overview&quot;, button displays all the instrument data.
            </EuiText>
            <EuiSpacer size="s" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={CurrentItem}
              alt={"CurrentItem"}
            />
          </p>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              In the data overview all data items and annotations - if available
              - are listed. In this view, annotations can be removed. By
              clicking on the pencil icon, the item can be edited.
            </EuiText>
            <EuiSpacer size="m" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={DataOverview}
              alt={"DataOverview"}
            />
          </p>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              The left bottom part of the page shows search results. The
              selected ontologies can be browsed via the search bar. The
              real-time results are ranked by string matching.
            </EuiText>
            <EuiSpacer size="m" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={ConceptSearch}
              alt={"ConceptSearch"}
            />
          </p>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              To view concept details you can click on the eye icon. To add the
              concept annotation to the currently selected item, the plus icon
              can be clicked.
            </EuiText>
            <EuiSpacer size="m" />
            <div>
              <EuiImage
                size="original"
                hasShadow
                allowFullScreen
                caption=""
                src={eyeIcon}
                alt={"eyeIcon"}
              />
              <EuiImage
                size="original"
                hasShadow
                allowFullScreen
                caption=""
                src={plusIcon}
                alt={"plusIcon"}
              />
            </div>
          </p>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              The concept details are displayed on the top right corner of the
              page. Alternative names (synonyms), Hierarchy and Cross references
              can be tabbed through if available.
            </EuiText>
            <EuiSpacer size="m" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={ConceptDetails}
              alt={"ConceptDetails"}
            />
          </p>

          <EuiSpacer size="l" />

          <EuiTitle>
            <h3>Export</h3>
          </EuiTitle>
          <EuiSpacer size="m" />
          <p>
            <EuiText>
              Data sets can be exported in Excel Spreadsheets. Questionnaires
              can be exported in JSON FHIR format.
            </EuiText>
            <EuiSpacer size="s" />
            <EuiImage
              size="original"
              hasShadow
              allowFullScreen
              caption=""
              src={Export}
              alt={"Export"}
            />
          </p>
        </EuiPageBody>
      </EuiPanel>
    </>
  );
};
