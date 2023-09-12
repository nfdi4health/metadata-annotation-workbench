import { useQuery, useQueryClient } from "react-query";
import { EuiButton, EuiCard, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiText, EuiToolTip, } from "@elastic/eui";
import React, { useState } from "react";
import { AutocompleteWidget, MetadataWidget } from "@nfdi4health/semlookp-widgets";
import { Question } from '../../pages/AnnotationPage'
import { useParams } from 'react-router-dom'

export interface ConceptSearchProps {
    currentDataItem: {
        currentDataItemId: number,
        projectId: string,
        text: string,
    }
    addAnnotation: Function;
    selectedItems?: Question[];
    ontologyList?: string;
}

interface SelectedEntity {
    iri: string,
    label: string,
    ontology_name: string,
    entityType: string
}

export default (props: ConceptSearchProps) => {
    const { ontologyList = "" } = useParams();
    const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>({
        iri: "",
        label: "",
        ontology_name: "",
        entityType: ""
    })
    const [isMaelstromDomain, setIsMaelstromDomain] = useState<boolean>(false)

    const onInputChange = (e: any) => {
        setSelectedEntity(
            {
                iri: e.iri,
                label: e.label,
                ontology_name: e.ontology_name,
                entityType: e.type
            });
    };

    const {
        isSuccess,
        data: maelstromDomainInfo
    } = useQuery({
        queryKey: ["maelstromDomainInfo", selectedEntity.iri],
        queryFn: () => {
            return fetch(
                `/api/maelstrom-domain?iri=${selectedEntity.iri}&ontology=${selectedEntity.ontology_name}`
            ).then((result) => result.json()
                .then((result) => setIsMaelstromDomain(result == "False" ? false : true)))
        },
        enabled: selectedEntity.iri != ""
    });

    return (
        <div>
            <EuiFlexGroup>
                <EuiFlexItem>
                    <EuiFlexItem>
                        <EuiPanel>
                            <EuiToolTip
                                position="top"
                                content={
                                    <p>
                                        The default free text search is across all textual fields in
                                        the terminologies, but results are ranked towards hits in
                                        labels, then synonyms, then definitions.
                                    </p>
                                }
                            >
                                <EuiText>
                                    <h4>Search</h4>
                                </EuiText>
                            </EuiToolTip>

                            <EuiSpacer size="m"/>

                            <AutocompleteWidget
                                api="https://semanticlookup.zbmed.de/ols/api/"
                                parameter={`ontology=${ontologyList}`}
                                placeholder="Search"
                                selectionChangedEvent={onInputChange}
                                allowCustomTerms={false}
                                hasShortSelectedLabel={true}
                            />
                            <EuiSpacer/>
                            {isSuccess && selectedEntity.iri != "" &&
                                <EuiButton
                                    isDisabled={isMaelstromDomain}
                                    onClick={() => props.addAnnotation(selectedEntity)}
                                >Add Annotation</EuiButton>}

                        </EuiPanel>
                    </EuiFlexItem>
                </EuiFlexItem>
                <EuiFlexItem style={{ maxWidth: "50%" }}>
                    <EuiPanel>
                        <EuiText>
                            <h4>Concept Information</h4>
                        </EuiText>
                        <EuiSpacer size="m"/>

                        {selectedEntity.iri != "" && (
                            <EuiCard title={""} textAlign="left" description="">
                                <MetadataWidget
                                    iri={selectedEntity.iri}
                                    api={"https://semanticlookup.zbmed.de/ols/api/"}
                                    entityType={selectedEntity.entityType == "class" ? "term" : selectedEntity.entityType}
                                    ontologyId={selectedEntity.ontology_name}
                                />
                            </EuiCard>
                        )}
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
