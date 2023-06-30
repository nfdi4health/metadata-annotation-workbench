import React, {useState} from "react";
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiHeader,
    EuiImage,
    EuiLink,
    EuiPageBody,
    EuiPanel,
    EuiSideNav,
    EuiSpacer,
    EuiText,
    EuiTitle
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
import suggestion from "../components/layout/images/suggestion.png";
import {EuiNavigationLink} from "../components/layout/util/EuiCustomLink";
import {useMatomo} from "@datapunt/matomo-tracker-react";

export default () => {
    const {trackPageView} = useMatomo();
    const [selectedItemName, setSelectedItem] = useState(null);

    // Track page view
    React.useEffect(() => {
        trackPageView();
    }, []);

    const selectItem = (name) => {
        setSelectedItem(name);
    };

    const createItem = (name, data = {}) => {
        // NOTE: Duplicate `name` values will cause `id` collisions.
        return {
            id: name,
            name,
            isSelected: selectedItemName === name,
            onClick: () => selectItem(name),
            ...data,
            href: '#' + name,
        };
    };

    const sideNav = [
        {
            name: 'Annotation Workbench Tutorial',
            id: 'Tutorial',
            items: [
                createItem('Import', {
                    forceOpen: true,
                    items: [
                        createItem('Create or select project'),
                        createItem('Upload data set', {
                            forceOpen: true,
                            items: [
                                createItem('Select a file for import'),
                                createItem('Import file'),
                                createItem('Select annotation column'),
                            ]
                        }),
                        createItem('Select code system')
                    ]
                }),
                createItem('Annotation', {
                    forceOpen: true,
                    items: [
                        createItem('Active variable'),
                        createItem('Data overview'),
                        createItem('Search'),
                        createItem('Suggestion'),
                        createItem('Add annotation'),
                        createItem('Metadata of Code System Elements'),
                        createItem('Delete all annotations'),
                        createItem('Automatic annotation')
                    ]
                }),
                createItem('Export')
            ]
        }]

    return (
        <>
            <EuiHeader/>
            <EuiSpacer/>
            <EuiFlexGroup>
                <EuiFlexItem grow={1}>
                    <EuiPanel>
                        <EuiSideNav items={sideNav}/>
                    </EuiPanel>
                </EuiFlexItem>
                <EuiFlexItem grow={9}>
                    <EuiPanel>
                        <EuiPageBody restrictWidth={true}>


                            <EuiTitle>
                                <h1>Tutorial</h1>
                            </EuiTitle>
                            <EuiSpacer size="l"/>
                            <EuiText>
                                This is a tutorial on how to use the Metadata Annotation Workbench.
                                General project information about this
                                service can be found{" "}
                                <EuiNavigationLink to="/about">here</EuiNavigationLink>.
                                This Workbench is intended to be used for metadata annotation at variable level.
                                The variables to annotate have to be listed in a column of an Excel Spreadsheet or CSV.
                                A usual workflow would be the following: Import the file and select the column with
                                the variables. Also select a code system from the provided list for reference of the
                                annotations. Annotate the variables with the provided user interface. Export the
                                Excel
                                Spreadsheet. All steps are described in detail below.
                            </EuiText>
                            <EuiSpacer size="l"/>


                            <EuiTitle>
                                <h2 id={'Import'}>Import</h2>
                            </EuiTitle>
                            <EuiSpacer size="m"/>
                            <EuiText id='Create or select project'>
                                <h3>1) Create or select a project</h3>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText><p>You can create a new project and upload a file or you can select an existing
                                project from the projects list. The projects are currently stored openly accessible.
                                With
                                software updates the data might get lost so make sure to export your data.</p>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText>
                                <b>Create a new project:</b>
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
                                <b>or select an existing project:</b>
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

                            <EuiSpacer size="m"/>

                            <EuiText id='Upload data set'><h3>2) Upload a data set</h3></EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText id='Select a file for import'>
                                <b>a) Select an Excel file</b>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText>
                                <p>Drag and drop a file from your local system to the input form or use the search
                                    function of the input form to select a file from your file system.</p>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText id='Import file'>
                                <b>b) Import the file</b>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText>
                                <p>Click on the import button to import the file.</p>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText id='Select annotation column'>
                                <b>c) Select the column for annotation</b>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText>
                                <p>If the file was successfully imported, please select a column from the dropdown
                                    menu for annotation.</p>
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


                            <EuiSpacer size={"m"}/>

                            <EuiText id='Select code system'>
                                <h3>
                                    3) Select a code system for annotation
                                </h3>
                            </EuiText>
                            <EuiSpacer size={"s"}/>
                            <EuiText>
                                <p>Currently
                                    all concept data will be retrieved from{" "}
                                    <EuiLink
                                        href="https://semanticlookup.zbmed.de/ols/index"> SemLookP </EuiLink>{" "}.
                                </p>
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


                            <EuiSpacer size="xxl"/>


                            <EuiTitle id='Annotation'>
                                <h2>Annotation</h2>
                            </EuiTitle>
                            <EuiSpacer size="m"/>
                            <EuiText id='Active variable'>
                                <h3>Active variable</h3>
                            </EuiText>
                            <EuiSpacer size="m"/>
                            <EuiText>
                                <p>
                                    The active variable is displayed on top of the page. The variable label/text
                                    is displayed on the left. On the top right
                                    side of the page, the annotations are listed. Multiple
                                    annotations can be added. With the buttons &quot;,Previous
                                    variable&quot;, and &quot;,Next variable&quot;,, you can run through the
                                    variables and add annotations variable wise.
                                </p>
                            </EuiText>
                            <EuiSpacer size="m"/>
                            <EuiImage
                                size="original"
                                hasShadow
                                allowFullScreen
                                caption=""
                                src={currentItem}
                                alt={"currentItem"}
                            />
                            <EuiSpacer size="xl"/>
                            <EuiText id='Data overview'><h3>Data overview</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    In the data overview all variables and annotations - if available
                                    - are listed. In this view, annotations can be removed. By
                                    clicking on the pencil icon, the variable can be selected as active variable.
                                    For the annotation of multiple variables with the same annotation at once, activate
                                    the variables by clicking on the check box. Then, click on the
                                    button <b>Annotate</b>.
                                    A search window opens and the variables can be annotated as described in <b>Add
                                    annotation</b>. To check/uncheck all variables click at the check box in the header
                                    of the table.
                                </p>
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
                            <EuiSpacer size="xl"/>
                            <EuiText id='Search'><h3>Search</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    The left bottom part of the page shows search results. The
                                    selected code system can be browsed via the search bar.
                                    The free text search is across all textual fields in
                                    the code systems, but results are ranked towards hits in
                                    labels, then synonyms, then definitions.
                                </p>
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
                            <EuiSpacer size="xl"/>
                            <EuiSpacer size="xl"/>
                            <EuiText id='Suggestion'><h3>Suggestion</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    You can switch between Search and Suggestion while annotating. This is only
                                    available
                                    for the Maelstrom Taxonomy! This is a prototypical function and not yet validated!
                                    Suggestions for annotation are generated using a BioBert model that was trained on
                                    the
                                    <EuiLink
                                        href="https://semanticlookup.zbmed.de/ols/index"> Maelstrom
                                        Catalogue </EuiLink>{" "}.
                                    The confidence value shows the probability of the element being detected correctly
                                    by the model.
                                </p>
                            </EuiText>
                            <EuiSpacer size="m"/>
                            <EuiImage
                                size="original"
                                hasShadow
                                allowFullScreen
                                caption=""
                                src={suggestion}
                                alt={"suggestion"}
                            />
                            <EuiSpacer size="xl"/>
                            <EuiText id='Add annotation'><h3>Add annotation</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    To view metadata of the elements you can click on the eye icon. To add the
                                    annotation to the active variable, the plus icon
                                    can be clicked.
                                </p>
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

                            <EuiSpacer size="m"/>
                            <EuiText id='Metadata of Code System Elements'><h3>Metadata of Code System
                                Elements</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    The element metadata is displayed on the top right corner of the
                                    page. Alternative names (synonyms), hierarchy and cross references
                                    can be tabbed through if available.
                                </p>
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

                            <EuiSpacer size="m"/>
                            <EuiText id='Delete all annotations'><h3>Delete all annotations</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    Delete all annotations at once. Cannot be undone!
                                </p>
                            </EuiText>

                            <EuiSpacer size="m"/>
                            <EuiText id='Automatic annotation'><h3>Automatic annotation</h3></EuiText>
                            <EuiSpacer size="s"/>
                            <EuiText>
                                <p>
                                    Automatically annotate all data items/questions with a Maelstrom Taxonomy suggestion.
                                    The Maelstrom suggestion with the highest confidence score is automatically selected.
                                    Items/questions already annotated are skipped. Cannot be undone!
                                </p>
                            </EuiText>

                            <EuiSpacer size="xxl"/>


                            <EuiTitle id='Export'>
                                <h2>Export</h2>
                            </EuiTitle>
                            <EuiSpacer size="m"/>
                            <EuiText>
                                <p>
                                    The project can be exported as Excel Spreadsheets or CSV.
                                    Annotations are included as separate columns.
                                    The different export options vary in compositions of the columns and information.
                                    The <i>labels only</i> option enables export of questions and corresponding annotations
                                    without data from the original data file.
                                </p>
                                <p><b>Default:</b> Label (e.g. <i>Age (qualifier value)</i>), ID (e.g. <i>397669002</i>), IRI (e.g. <i>http://snomed.info/id/397669002</i>) and ontology (e.g. <i>snomed</i>) in separate columns</p>
                                <p><b>Maelstrom OPAL:</b> Maelstrom domain (e.g. Mlstr_area::Sociodemographic_economic_characteristics) as column header, Maelstrom tag (e.g. Age) in column cell. Only available for annotations with the Maelstrom taxonomy!</p>
                                <p><b>Maelstrom simple form:</b> combined Maelstrom annotation (e.g. <i>Mlstr_area::Administrative information::Other administrative information</i>) in columns</p>
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
                        </EuiPageBody>
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </>
    );
};
