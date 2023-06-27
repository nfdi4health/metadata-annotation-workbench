import React, { useState } from "react";
import saveAs from "file-saver";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { EuiButton, EuiSpacer, EuiSwitch, EuiToolTip } from "@elastic/eui";
import ExportDropDown from './ExportDropDown'

export default () => {
  const { projectId } = useParams();
  const [exportForm, setExportForm] = useState("default");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [exportOnlyAnnotations, setExportOnlyAnnotations] = useState<boolean>(true);

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

  const mutation_export_xlsx = useMutation(() => {
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

  const mutation_export_csv = useMutation(() => {
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
          mutation_export_xlsx.mutate()
      }
      if(exportFormat == "csv"){
          mutation_export_csv.mutate()
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
        label="only labels"
        checked={exportOnlyAnnotations}
        onChange={(e) => setExportOnlyAnnotations(e.target.checked)}
      />
        <EuiSpacer />
      <EuiButton fill onClick={saveFile} iconType={'download'}>
        Download
      </EuiButton>
    </>
  );
};
