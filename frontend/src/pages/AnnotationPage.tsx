import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CurrentItemArea from "../components/currentDataItem/CurrentItemArea";
import { DataItemIF } from "../api";
import {
  EuiButton,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiHeader,
  EuiPageBody,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from "@elastic/eui";
import InstrumentOverview from "../components/dataOverview/InstrumentOverview";

import { useMatomo } from "@datapunt/matomo-tracker-react";
import ExportPage from "../components/export/Export";
import InstrumentTable from '../components/dataOverview/InstrumentTable'
import { createDangerToast, createSuccessToast, useToastContext } from '../components/toast/ToastContext'
import ConceptArea from '../components/annotations/ConceptArea'

export type Question = {
    instrument_name: string;
    linkId: number;
    pk_item: number;
    row_num_item: number;
    section: string;
    text: string;
    type: string;
    typeX: string;
}

interface mutationInputParams {
    question: any,
    annotationItem: any
}

export default () => {
  const { trackPageView } = useMatomo();
  // Track page view
  React.useEffect(() => {
    trackPageView({});
  }, []);

  const { projectId, ontologyList = "" } = useParams();
  const [currentDataItem, setCurrentDataItem] = useState<DataItemIF>();
  const [hasPreviousDataItem, setHasPreviousDataItem] = useState(false);
  const [hasNextDataItem, setHasNextDataItem] = useState(true);
  const [hasSuccessfullImport, setHasSuccessfullImport] = useState(false);
  const [hasVisibleFlyout, setHasVisibleFlyout] = useState(false);
  const [hasVisibleFlyoutExport, setHasVisibleFlyoutExport] = useState(false);
  const [currentItemNumber, setCurrentItemNumber] = useState(0);
  const queryClient = useQueryClient();
    const { addToast } = useToastContext();

  const toggleFlyout = () => setHasVisibleFlyout(!hasVisibleFlyout);
  const toggleFlyoutExport = () =>
    setHasVisibleFlyoutExport(!hasVisibleFlyoutExport);

  const { data: instrumentData, isSuccess } = useQuery(
    ["dataItems", projectId],
    () => {
      return fetch(`/api/dataItems?projectId=${projectId}`).then((result) =>
        result.json()
      );
    }
  );

  useEffect(() => {
    if (isSuccess && instrumentData[currentItemNumber] !== undefined) {
      setHasSuccessfullImport(true);
      setCurrentDataItem({
        currentDataItemId: instrumentData[currentItemNumber].linkId,
        projectId: instrumentData[currentItemNumber].instrument_name,
        text: instrumentData[currentItemNumber].text,
        section: instrumentData[currentItemNumber].section,
        rowNum: instrumentData[currentItemNumber].row_num_item,
        setCurrentDataItem: setCurrentDataItem,
      });
    } else {
      setHasSuccessfullImport(false);
    }
  }, [instrumentData, currentItemNumber]);

  useEffect(() => {
    if (currentDataItem) {
      currentDataItem.rowNum === instrumentData.length
        ? setHasNextDataItem(true)
        : setHasNextDataItem(false);
      currentDataItem.rowNum === 1
        ? setHasPreviousDataItem(true)
        : setHasPreviousDataItem(false);
    }
  }, [currentDataItem]);

  const mutation = useMutation(
        (item: any) =>
            fetch(
                `/api/annotation?projectId=${currentDataItem?.projectId}&currentDataItemId=${currentDataItem?.currentDataItemId}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        content: item,
                    }),
                }
            ).then((result) => result.json()),
        {
            onSuccess: (result) => {
                queryClient.invalidateQueries("annotation");
                result === "isInDB"
                    ? addToast(createSuccessToast("Annotation exists.", ""))
                    : addToast(createSuccessToast("Annotation saved!", ""));
            },
            onError: () => {
                addToast(createDangerToast("Annotation not saved!", ""));
            },
        }
    );

    const addAnnotation = (item: any) => {
        mutation.mutate(item);
    };

  const nextDataItem = () => {
    if (currentDataItem) {
      setCurrentItemNumber((currentItemNumber) => currentItemNumber + 1);
    }
  };

  const previousDataItem = () => {
    if (currentDataItem) {
      setCurrentItemNumber((currentItemNumber) => currentItemNumber - 1);
    }
  };

  let flyout;

  const addMultipleAnnotation = useMutation(
        ({ question, annotationItem }: mutationInputParams) =>
            fetch(
                `/api/annotation?projectId=${question.instrument_name}&currentDataItemId=${question.linkId}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        content: annotationItem,
                    }),
                }
            ).then((result) => result.json()),
        {
            onSuccess: (result) => {
                queryClient.invalidateQueries("annotation");
                result === "isInDB"
                    ? addToast(createSuccessToast("Annotation exists.", ""))
                    : addToast(createSuccessToast("Annotation saved!", ""));
            },
            onError: () => {
                addToast(createDangerToast("Annotation not saved!", ""));
            },
        }
    );

    const addAnnotationToSelectedItem = (question: Question, annotationItem: any) => {
        addMultipleAnnotation.mutate({ question, annotationItem });
    };

    const annotateSelectedItems = (annotationItem: any, selectedItems: Question[]) => {
        if (selectedItems && selectedItems.length > 0) {
            selectedItems.forEach((question: Question) => addAnnotationToSelectedItem(question, annotationItem))
        }
    }

  if (hasVisibleFlyout && currentDataItem && isSuccess) {
    flyout = (
      <InstrumentTable
        currentDataItem={{
          currentDataItemId: currentDataItem.currentDataItemId,
          projectId: currentDataItem.projectId,
          text: currentDataItem.text,
          setCurrentDataItem: currentDataItem.setCurrentDataItem,
        }}
        data={instrumentData}
        toggleFlyout={toggleFlyout}
        setCurrentItemNumber={setCurrentItemNumber}
        currentItemNumber={currentItemNumber}
        addAnnotation={addAnnotation}
        ontologyList={ontologyList}
        annotateSelectedItems={annotateSelectedItems}
      />
    );
  }

  let flyoutExport;
  if (hasVisibleFlyoutExport) {
    flyoutExport = (
      <EuiFlyout ownFocus onClose={() => toggleFlyoutExport()}>
        <EuiFlyoutHeader>
          <EuiText>
            <h3>Export</h3>
          </EuiText>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <ExportPage />
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  if (!hasSuccessfullImport) {
    return <p>Something went wrong with the import. Please try again.</p>;
  } else {
    return (
      <>
        <EuiHeader></EuiHeader>
        {projectId && (
          <EuiPageBody paddingSize="m">
            <EuiPageBody paddingSize="m">
              {currentDataItem && instrumentData && (
                <>
                  {flyout}

                  <EuiFlexGroup justifyContent="spaceBetween">
                    <EuiFlexItem grow={false}>
                      <EuiToolTip
                        position="top"
                        content={
                          <p>
                            Here you can get an overview of all of your data.
                          </p>
                        }
                      >
                        <EuiButton onClick={toggleFlyout}>
                          Data overview
                        </EuiButton>
                      </EuiToolTip>
                    </EuiFlexItem>

                    <EuiFlexItem></EuiFlexItem>

                    <EuiFlexItem>
                      <EuiCallOut color="warning" iconType="help">
                        <p>
                          Data will be lost on software updates. Please export
                          your data!
                        </p>
                      </EuiCallOut>
                    </EuiFlexItem>

                    <EuiFlexItem grow={false}>
                      <EuiToolTip position="top" content={<p>Export</p>}>
                        <EuiButton fill onClick={toggleFlyoutExport}>
                          Export
                        </EuiButton>
                      </EuiToolTip>
                      {flyoutExport}
                    </EuiFlexItem>
                  </EuiFlexGroup>

                  <EuiSpacer size="m" />

                  <EuiPanel>
                    <EuiText>
                      <h4>Current variable</h4>
                    </EuiText>
                    <EuiSpacer size="m" />
                    <CurrentItemArea
                      currentDataItem={{
                        currentDataItemId: currentDataItem.currentDataItemId,
                        projectId: currentDataItem.projectId,
                      }}
                    />
                    <EuiFlexGroup>
                      <EuiFlexItem>
                        <EuiButton
                          isDisabled={hasPreviousDataItem}
                          iconType="arrowLeft"
                          onClick={() => previousDataItem()}
                          fill
                        >
                          Previous variable
                        </EuiButton>
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiButton
                          isDisabled={hasNextDataItem}
                          iconSide="right"
                          iconType="arrowRight"
                          onClick={() => nextDataItem()}
                          fill
                        >
                          Next variable
                        </EuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPanel>

                  <EuiSpacer size="xl" />

                  <ConceptArea
                    currentDataItem={{
                      currentDataItemId: currentDataItem.currentDataItemId,
                      projectId: currentDataItem.projectId,
                      text: currentDataItem.text,
                    }}
                    addAnnotation={addAnnotation}
                    ontologyList={ontologyList}
                  />
                </>
              )}
            </EuiPageBody>
          </EuiPageBody>
        )}
      </>
    );
  }
};
