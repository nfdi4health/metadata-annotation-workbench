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
import createNewProject from "../components/layout/images/createNewProject.png";
import selectExistingProject from "../components/layout/images/selectExistingProject.png";
import upload from "../components/layout/images/upload.png";
import selectOntology from "../components/layout/images/selectOntology.png";
import currentItem from "../components/layout/images/currentItem.png";
import dataOverview from "../components/layout/images/dataOverview.png";
import search from "../components/layout/images/search.png";
import metadata from "../components/layout/images/metadata.png";
import exportView from "../components/layout/images/export.png";
import {EuiNavigationLink} from "../components/layout/util/EuiCustomLink";
import {useMatomo} from "@datapunt/matomo-tracker-react";

export default () => {
    const {trackPageView} = useMatomo();

    // Track page view
    React.useEffect(() => {
        trackPageView();
    }, []);

    return (
        <>
            <EuiHeader/>
            <EuiPanel hasShadow={true}>
                <EuiPageBody restrictWidth={true}>
                    {/*<EuiCallOut size="s" title="Under construction" iconType="alert">*/}
                    {/*    <p>*/}
                    {/*        The tutorial page refers to an older version of the software and*/}
                    {/*        needs to be updated. However, the basic functions are the same and*/}
                    {/*        this page can provide first guidance.*/}
                    {/*    </p>*/}
                    {/*</EuiCallOut>*/}

                    <EuiTitle>
                        <h1>Tutorial</h1>
                    </EuiTitle>
                    <EuiSpacer size="l"/>
                    <p>
                        <EuiText>
                            This software is currently in active development. Existing
                            features are regularly updated and new features are added. Please
                            forgive any errors that occur. Project information about this
                            service can be found{" "}
                            <EuiNavigationLink to="/about">here</EuiNavigationLink>.
                        </EuiText>
                    </p>
                    <EuiSpacer size="l"/>
                    <EuiTitle>
                        <h3>Import</h3>
                    </EuiTitle>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            <h5>1) Create or select a project</h5>
                        </EuiText>
                        <EuiSpacer size={"s"}/>
                        <EuiText>
                            a) Create a new project OR
                        </EuiText>
                        <EuiSpacer size={"s"}/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={createNewProject}
                            alt={"projectName"}
                        />
                        <EuiSpacer size={"s"}/>
                        <EuiText>
                            b) select an existing project.
                        </EuiText>
                        <EuiSpacer size={"s"}/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={selectExistingProject}
                            alt={"projectName"}
                        />
                        <EuiSpacer size={"s"}/>
                        <EuiText>
                            Currently,
                            a project consists of a single data set/file. The data is stored
                            freely accessible in the database. With every update or software
                            release, all data is lost, due to the prototype status of the
                            tool. Make sure, to export your data if you want to keep it.
                        </EuiText>
                        <EuiSpacer size={"s"}/>
                    </p>

                    <EuiSpacer size="m"/>

                    <p>
                        <EuiText><h5>2) Upload a data set</h5></EuiText>
                        <EuiSpacer size={"s"}/>
                        <EuiText>
                            <ul>
                                <li>Select an Excel file</li>
                                <li>Import the file</li>
                                <li>Select the column for annotation</li>
                            </ul>
                        </EuiText>
                        <EuiSpacer size={"s"}/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={upload}
                            alt={"upload"}
                        />
                    </p>

                    <EuiSpacer size={"m"}/>

                    <p>
                        <EuiText>
                            3) Select a or multiple terminologies for annotation. Currently
                            all concept data will be retrieved from{" "}
                            <EuiLink href="https://semanticlookup.zbmed.de/ols/index">
                                SemLookP
                            </EuiLink>{" "}
                            .
                        </EuiText>
                        <EuiSpacer size="s"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={selectOntology}
                            alt={"selectOntology"}
                        />
                    </p>

                    <EuiSpacer size="l"/>

                    <EuiTitle>
                        <h3>Annotation</h3>
                    </EuiTitle>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            The current item is displayed on top of the page. The item label
                            or text are displayed on the left. On the top right
                            side of the page, the annotations are listed. Multiple
                            annotations can be added. With the buttons &quot;,Previous
                            item&quot;, and &quot;,Next item&quot;,, you can run through the
                            instrument data and add annotations item wise.
                        </EuiText>
                        <EuiSpacer size="s"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={currentItem}
                            alt={"currentItem"}
                        />
                    </p>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            In the data overview all data items and annotations - if available
                            - are listed. In this view, annotations can be removed. By
                            clicking on the pencil icon, the item can be edited.
                        </EuiText>
                        <EuiSpacer size="m"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={dataOverview}
                            alt={"dataOverview"}
                        />
                    </p>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            The left bottom part of the page shows search results. The
                            selected ontologies can be browsed via the search bar. The
                            real-time results are ranked by string matching.
                        </EuiText>
                        <EuiSpacer size="m"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={search}
                            alt={"search"}
                        />
                    </p>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            To view concept details you can click on the eye icon. To add the
                            concept annotation to the currently selected item, the plus icon
                            can be clicked.
                        </EuiText>
                        <EuiSpacer size="m"/>
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
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            The concept details are displayed on the top right corner of the
                            page. Alternative names (synonyms), Hierarchy and Cross references
                            can be tabbed through if available.
                        </EuiText>
                        <EuiSpacer size="m"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={metadata}
                            alt={"metadata"}
                        />
                    </p>

                    <EuiSpacer size="l"/>

                    <EuiTitle>
                        <h3>Export</h3>
                    </EuiTitle>
                    <EuiSpacer size="m"/>
                    <p>
                        <EuiText>
                            Data sets can be exported in Excel Spreadsheets. Questionnaires
                            can be exported in JSON FHIR format.
                        </EuiText>
                        <EuiSpacer size="s"/>
                        <EuiImage
                            size="original"
                            hasShadow
                            allowFullScreen
                            caption=""
                            src={exportView}
                            alt={"exportView"}
                        />
                    </p>
                </EuiPageBody>
            </EuiPanel>
        </>
    );
};
