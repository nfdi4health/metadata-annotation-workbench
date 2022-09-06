from urllib.parse import quote

import requests


def filter_class(obj):
    if obj:
        if len(obj['response']['docs']) != 0:
            for i in reversed(range(len(obj['response']['docs']))):
                if obj["response"]["docs"][i]["type"] != "class":
                    del obj['response']['docs'][i]
    return obj

def filter_maelstrom_domains(obj):
    if obj:
        if len(obj['response']['docs']) != 0:
            for i in reversed(range(len(obj['response']['docs']))):
                iri_encoded = quote(quote(obj['response']['docs'][i]["iri"], safe='~()*!\''), safe='~()*!\'')
                if obj['response']['docs'][i]["ontology_name"] == "maelstrom":
                    response_parent = requests.get(
                        "https://semanticlookup.zbmed.de/ols/api/ontologies/maelstrom/terms/" + iri_encoded + "/parents").json()
                    if response_parent["_embedded"]["terms"][0]["label"] == "Thing":
                        del obj['response']['docs'][i]
    return obj

def filter_ontology_information(obj, ontology):
    if obj:
        if len(obj['response']['docs']) != 0:
            for i in range(len(obj['response']['docs'])):
                if obj['response']['docs'][0]['short_form'] == ontology:
                    del obj['response']['docs'][0]
    return obj