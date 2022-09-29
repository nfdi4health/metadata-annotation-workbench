import React, { useState } from "react";
import { useMutation } from "react-query";
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiHeader,
  EuiPageHeader,
  EuiPanel,
  EuiSpacer,
  EuiTitle,
} from "@elastic/eui";
import { useNavigate } from "react-router";
import Projektinformation from "../components/layout/Projektinformation";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import TerminologySelection from "../components/import/TerminologySelection";
import ProjectName from "../components/import/ProjectName";
import ImportExcel from "../components/import/ImportExcel";
import { Helmet } from "react-helmet";
import { ReactComponent as NFDI4HEALTHLOGO } from "../components/layout/logos/NFDI4Health_Logo_cmyk_RZ.svg";

export default () => {
  const { trackPageView } = useMatomo();
  // Track page view
  React.useEffect(() => {
    trackPageView({});
  }, []);

  const [projectId, setProjectId] = useState("");
  const [ontologyList, setOntologyList] = useState<[]>();
  const [files, setFiles] = useState<string | Blob>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasProjectName, setHasProjectName] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [hasProjectExists, setHasProjectExists] = useState(false);
  const [selectedAnnotationColumn, setSelectedAnnotationColumn] = useState<[]>(
    []
  );
  const [toggleIdSelected, setToggleIdSelected] = useState<string>("maelstrom");
  const navigate = useNavigate();
  const [showErrorsExistingProjectName, setShowErrorsExistingProjectName] =
    useState(false);
  const [hasColumnAndFile, setHasColumnAndFile] = useState<boolean>(false);

  const mutationGetColumns = useMutation(() => {
    const file = new FormData();
    file.append("file", files);
    return fetch(
      `/api/instrument?projectId=${projectId}&&col=${JSON.stringify(
        selectedAnnotationColumn
      )}&&option=${toggleIdSelected}`,
      {
        method: "POST",
        body: file,
      }
    );
  });

  const mutationImportFile = useMutation(() => {
    const file = new FormData();
    file.append("file", files);
    return fetch(`/api/import?projectId=${projectId}`, {
      method: "POST",
      body: file,
    });
  });

  const annotateProject = async () => {
    if (hasColumnAndFile && hasProjectName && ontologyList?.length !== 0) {
      await mutationGetColumns.mutate();
    }
    if (hasProjectExists && hasProjectName && ontologyList?.length !== 0) {
      await mutationGetColumns.mutate();
    }
  };

  if (
    (mutationImportFile.isSuccess && ontologyList) ||
    (mutationGetColumns.isSuccess && ontologyList)
  ) {
    navigate("/annotation/" + projectId + "/" + ontologyList.toString(), {
      replace: true,
    });
  }

  return (
    <>
      <EuiPageHeader>
        <EuiHeader />
      </EuiPageHeader>

      <Helmet>
        <title> Metadata Annotation Workbench </title>
      </Helmet>

      <EuiFlexGroup justifyContent="spaceAround">
        <EuiFlexItem grow={false}>
          <NFDI4HEALTHLOGO height="170px" width="auto" />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="xl" />

      <EuiSpacer size="xl" />

      <EuiFlexGroup justifyContent="spaceAround">
        <EuiForm component="form">
          <ProjectName
            setHasProjectExists={setHasProjectExists}
            setHasProjectName={setHasProjectName}
            setProjectId={setProjectId}
          ></ProjectName>
          <EuiSpacer />

          {!hasProjectExists && (
            <EuiPanel>
              <EuiSpacer />
              <EuiFlexItem>
                <ImportExcel
                  setFiles={setFiles}
                  setHasFile={setHasFile}
                  files={files}
                  selectedAnnotationColumn={selectedAnnotationColumn}
                  setSelectedAnnotationColumn={setSelectedAnnotationColumn}
                  hasFile={hasFile}
                  setHasColumnAndFile={setHasColumnAndFile}
                />
              </EuiFlexItem>
            </EuiPanel>
          )}
        </EuiForm>
      </EuiFlexGroup>

      <EuiSpacer size="xl" />

      <EuiFlexGroup>
        <EuiFlexItem grow={8}>
          <TerminologySelection
            setOntologyList={setOntologyList}
            ontologyList={ontologyList}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="xl" />

      <EuiFlexGroup>
        <EuiFlexItem grow={6}>
          <EuiFlexGroup>
            <EuiFlexItem grow={8}> </EuiFlexItem>
            <EuiFlexItem grow={2}>
              <EuiButton fill onClick={() => annotateProject()}>
                Annotate
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="xl" />

      <EuiFlexGroup justifyContent={"spaceAround"}>
        <EuiFlexItem grow={3}>
          <EuiPanel hasShadow={true}>
            <EuiTitle>
              <h1>Metadata Annotation Workbench</h1>
            </EuiTitle>
            <EuiSpacer />
            <Projektinformation />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
