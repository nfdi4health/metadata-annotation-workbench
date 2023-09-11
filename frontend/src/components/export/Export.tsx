import React, { useState } from "react";
import saveAs from "file-saver";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { EuiButton, EuiLoadingSpinner, EuiSpacer, EuiSwitch, EuiToolTip } from "@elastic/eui";
import ExportDropDown from './ExportDropDown'

export default () => {
  const { projectId } = useParams();
  const [exportForm, setExportForm] = useState("opal");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [exportOnlyAnnotations, setExportOnlyAnnotations] = useState<boolean>(false);

  const mutation_export_json = useMutation(() => {
    return fetch(
      "/api/instrument?projectName=" + projectId + "&exportForm=" + exportForm + "&exportFormat=" + exportFormat + "&exportOnlyAnnotations=" + exportOnlyAnnotations,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => saveAs.saveAs(blob, "file.json"));
  });

  const {mutate: mutation_export_xlsx, isLoading: isLoadingXLSX} = useMutation(() => {
    return fetch(
      "/api/instrument?projectName=" + projectId + "&exportForm=" + exportForm + "&exportFormat=" + exportFormat + "&exportOnlyAnnotations=" + exportOnlyAnnotations,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/vnd.ms-excel",
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => saveAs.saveAs(blob, "file.xlsx"));
  });

  const { mutate: mutation_export_csv, isLoading: isLoadingCSV } = useMutation(() => {
    return fetch(
      "/api/instrument?projectName=" + projectId + "&exportForm=" + exportForm + "&exportFormat=" + exportFormat + "&exportOnlyAnnotations=" + exportOnlyAnnotations,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => saveAs.saveAs(blob, "file.csv"));
  });

  const saveFile = () => {
      if(exportFormat == "xlsx"){
          // @ts-ignore
          mutation_export_xlsx()
      }
      if(exportFormat == "csv"){
          // @ts-ignore
          mutation_export_csv()
      }
  };

  const optionsForm = [
    { value: "default", text: "Default" },
    { value: "opal", text: "Maelstrom OPAL" },
    { value: "simple", text: "Maelstrom simple form" },
  ];

  const optionsFormat = [
    { value: "xlsx", text: "XLSX" },
    { value: "csv", text: "CSV" },
  ];

  return (
    <>
      <ExportDropDown onChange={setExportFormat} options={optionsFormat} title={"File format"} type={exportFormat}/>
      <EuiSpacer />
        <ExportDropDown onChange={setExportForm} options={optionsForm} title={"File form"} type={exportForm}/>
        <EuiSpacer />
        <EuiSwitch
        label="labels only"
        checked={exportOnlyAnnotations}
        onChange={(e) => setExportOnlyAnnotations(e.target.checked)}
      />
        <EuiSpacer />
      <EuiButton fill onClick={saveFile} iconType={'download'}>
        Download
      </EuiButton>
        {(isLoadingXLSX || isLoadingCSV) && <EuiLoadingSpinner></EuiLoadingSpinner>}
    </>
  );
};
