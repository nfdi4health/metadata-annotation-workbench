from urllib.parse import quote

import pandas as pd
import requests


def get_codes_for_linkId(linkId, codes):
    codelist = []
    for ele in codes:
        if ele.code_linkId == linkId:
            codelist.append(ele.code)
    return codelist


def get_all_domains():
    # TODO code does only returns 14 of 18 domains
    # TODO add Maelstrom Additionals
    # url = "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms?size=500"
    # response = requests.get(url).json()
    # all_domains = ["Mlstr_area::" + domain["synonyms"][0].replace(' ', '_') for domain in response["_embedded"]["terms"]
    #               if (domain["synonyms"] is not None and domain["is_root"])]
    return [
        'Mlstr_area::Symptoms_signs',
        'Mlstr_area::Non_pharmacological_interventions',
        'Mlstr_area::Health_community_care_utilization',
        'Mlstr_area::Sociodemographic_economic_characteristics',
        'Mlstr_area::Social_environment',
        'Mlstr_area::Medication_supplements',
        'Mlstr_area::Preschool_school_work',
        'Mlstr_area::Life_events_plans_beliefs',
        'Mlstr_area::Lifestyle_behaviours',
        'Mlstr_area::Cognitive_psychological_measures',
        'Mlstr_area::End_of_life',
        'Mlstr_area::Physical_measures',
        'Mlstr_area::Health_status_functional_limitations',
        'Mlstr_area::Reproduction',
        'Mlstr_area::Diseases',
        'Mlstr_area::Laboratory_measures',
        'Mlstr_area::Physical_environment',
        'Mlstr_area::Administrative_information',
    ]


def export_maelstrom_annotations_opal(df, instrument, questions, codes):
    all_domains = get_all_domains()

    # add all domains to df
    df = pd.concat([df, pd.DataFrame(columns=all_domains)])

    for index, row in df.iterrows():
        annotation_col = instrument[0].annotation_column
        if isinstance(row[annotation_col], str):
            for q in questions:
                if q.text == row[annotation_col]:
                    linkId = q.linkId

                    codes_linkId = get_codes_for_linkId(linkId, codes)

                    for ele in codes_linkId:
                        iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
                        url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
                        response = requests.get(url).json()

                        if response["_embedded"]["terms"][0]["ontology_name"] != "maelstrom":
                            return ("Not a maelstrom concept")

                        if (response["_embedded"]["terms"][0]["synonyms"] is None):
                            label = response["_embedded"]["terms"][0]["label"]
                        else:
                            label = response["_embedded"]["terms"][0]["synonyms"][0].replace(' ', '_')

                        response_parent = requests.get(
                            "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
                        if(response_parent["_embedded"]["terms"][0]["synonyms"] is None):
                            label_parent = response_parent["_embedded"]["terms"][0]["label"].replace(' ', '_')
                        else:
                            label_parent = response_parent["_embedded"]["terms"][0]["synonyms"][0].replace(' ', '_')

                        maelstrom_prefix = "Mlstr_area::"

                        df.at[index, maelstrom_prefix + label_parent] = label

    df = df[df.filter(regex='^(?!Unnamed)').columns]
    return df


def export_maelstrom_annotations_opal_only_annotations(questions, codes):
    df = pd.DataFrame(columns=['label'])

    for q in questions:
        linkId = q.linkId

        codes_linkId = get_codes_for_linkId(linkId, codes)

        for ele in codes_linkId:
            iri_encoded = quote(quote(str(ele), safe='~()*!\''), safe='~()*!\'')
            url = "https://semanticlookup.zbmed.de/ols/api/terms/" + iri_encoded
            response = requests.get(url).json()

            if response["_embedded"]["terms"][0]["ontology_name"] != "maelstrom":
                return ("Not a maelstrom concept")

            label = response["_embedded"]["terms"][0]["label"]
            response_parent = requests.get(
                "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
            label_parent = response_parent["_embedded"]["terms"][0]["label"]

            maelstrom_prefix = "Mlstr_area::"

            df = df.append({'label': q.text}, ignore_index=True)

            for index, row in df.iterrows():
                if isinstance(row['label'], str):
                    if q.text == row['label']:
                        df.at[index, maelstrom_prefix + label_parent] = label

    return df
