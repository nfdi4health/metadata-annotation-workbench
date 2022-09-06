import os

import pandas as pd
import requests
from flask import Flask, send_from_directory
from flask import jsonify, request, json
from flask_cors import CORS
from sqlalchemy import insert
from urllib.parse import quote

from restapi.models import db
from restapi.models.models import Item, AnswerOption, Instrument, Code
from restapi.services.exporter.export_maelstrom import export_maelstrom
from restapi.services.exporter.export_questionnaire import db_to_fhirJson, db_to_df
from restapi.services.exporter.export_xlsx import get_original_xlsx_and_annotations
from restapi.services.filter_search_results import filter_class, filter_maelstrom_domains, filter_ontology_information
from restapi.services.importer.import_excel import single_column_to_db
from restapi.services.importer.import_maelstrom import import_maelstrom
from restapi.services.importer.import_questionnaire import questionnaire_to_db
from restapi.database import init_db, session, engine
from restapi.services.preprocess_sentence import preprocess_sentence


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    init_db()

    DATABASE_URL = os.environ.get("DATABASE_URL")
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config['JSON_SORT_KEYS'] = False
    db.init_app(app)

    ols = os.environ.get('API_SEMLOOKP')
    instruments = os.environ.get('INSTRUMENTS')

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        session.remove()

    @app.route("/")
    def index():
        return "<p>Hello, this is an API-Service!</p>"

    @app.route('/api/import/file-exists', methods=["GET"])
    def check_if_file_exists():
        try:
            request.files["file"]
        except KeyError:
            return jsonify("noFileProvided")
        else:
            return jsonify("fileProvided")

    @app.route('/api/import/projectId-exists', methods=["GET"])
    def check_if_projectname_exists():
        projectId = request.args.get('projectId', type=str)
        exists = db.session.query(Instrument.name).filter_by(name=projectId).first() is not None
        if exists and projectId != "":
            return jsonify("true")
        else:
            return jsonify("false")

    @app.route('/api/projectNames', methods=["GET"])
    def get_projectNames():
        query = db.session.query(Instrument.name).all()
        return jsonify(query)

    @app.route('/api/dataItems', methods=["GET"])
    def load_dataItems():
        projectId = request.args.get('projectId', type=str)
        query = db.session.query(Item).filter_by(instrument_name=projectId).all()
        return jsonify([c.as_dict() for c in query])

    @app.route('/api/dataItem', methods=["GET"])
    def load_dataItem():
        projectId = request.args.get('projectId', type=str)
        currentDataItemId = request.args.get('currentDataItemId', type=str)
        query = db.session.query(Item).filter_by(instrument_name=projectId).filter_by(linkId=currentDataItemId).all()
        return jsonify([c.as_dict() for c in query])

    @app.route('/api/annotation', methods=['PUT'])
    def add_annotation():
        request_data = json.loads(request.data)
        projectId = request.args.get('projectId', type=str)
        currentDataItemId = request.args.get('currentDataItemId', type=int)

        if request_data:
            isInDB = False

            # if 'similarity' in request_data["content"].keys():
            #     code = request_data["content"]["term"]
            # else:
            #     code = request_data["content"]["short_form"] + ' | ' + request_data["content"]["label"]

            code = request_data["content"]["iri"]

            query = db.session.query(Code).filter_by(instrument_name=projectId) \
                .filter_by(code_linkId=currentDataItemId).all()
            l = [c.as_dict() for c in query]
            for element in l:
                if code == element["code"]:
                    isInDB = True
                    return jsonify('isInDB')
            if not isInDB:
                stmt = (
                    insert(Code).
                    values(code_linkId=currentDataItemId, code=code, instrument_name=projectId)
                )
                session.execute(stmt)
                session.commit()
        return jsonify('isNotInDB')

    @app.route('/api/annotation', methods=['DELETE'])
    def remove_annotation():
        request_data = json.loads(request.data)
        projectId = request.args.get('projectId', type=str)

        if request_data:
            session.query(Code).filter_by(instrument_name=projectId) \
                .filter_by(code=request_data["content"]["code"]) \
                .filter_by(code_linkId=request_data["content"]["code_linkId"]) \
                .delete()
            session.commit()

        return request_data

    @app.route('/api/answeroptions', methods=["GET"])
    def load_answer_options():
        project_name = request.args.get('projectName', type=str)
        linkId = request.args.get('linkId', type=str)
        query = db.session.query(AnswerOption).filter_by(instrument_name=project_name) \
            .filter_by(item_linkId=linkId).all()
        # query = db.session.query(AnswerOption).filter_by(instrument_name=project_name).all()
        return jsonify([c.as_dict() for c in query])

    @app.route('/api/code', methods=["GET"])
    def load_code():
        project_name = request.args.get('projectName', type=str)
        linkId = request.args.get('linkId', type=str)
        query = db.session.query(Code).filter_by(instrument_name=project_name) \
            .filter_by(code_linkId=linkId).all()
        return jsonify([c.as_dict() for c in query])

    @app.route('/api/ols', methods=["GET"])
    def api_ols():
        ontology = request.args.get('ontology', type=str)
        q = request.args.get('q', type=str)

        if ontology == "maelstrom":
            q = preprocess_sentence(q)

        payload = {'q': q, 'ontology': ontology, 'rows': 100000000}
        r = requests.get(ols + 'search', params=payload)
        obj = r.json()

        obj = filter_class(obj)
        obj = filter_maelstrom_domains(obj)
        obj = filter_ontology_information(obj, ontology)

        return obj

    @app.route('/api/ols/term', methods=["GET"])
    def api_ols_term():
        q = request.args.get('iri', type=str)

        payload = {'q': quote(quote(q, safe='~()*!\''), safe='~()*!\'')}
        r = requests.get(ols + 'ontologies/terms/', params=payload)
        obj = r.json()
        print(obj)

        return(obj["_embedded"]["terms"][0]["label"])

    @app.route('/api/ols/ontology', methods=["GET"])
    def api_ols_ontology():
        q = request.args.get('iri', type=str)

        payload = {'q': quote(quote(q, safe='~()*!\''), safe='~()*!\'')}
        r = requests.get(ols + 'ontologies/terms/', params=payload)
        obj = r.json()
        print(obj)

        return (obj["_embedded"]["terms"][0]["label"])

    @app.route('/api/ols/ontologies', methods=["GET"])
    def api_ols_ontologies():
        r = requests.get(ols + 'ontologies?size=500')
        result = r.json()
        ontologies = []
        for ontology in result['_embedded']['ontologies']:
            ontologies.append({'label': ontology['config']['title'],
                               'description': ontology['ontologyId'],
                               'number_of_terms': ontology['numberOfTerms'],
                               'preferred_prefix': ontology['config']['preferredPrefix'],
                               'definition': ontology['config']['description'],
                               'homepage': ontology['config']['homepage'],
                               'version': ontology['config']['version'],
                               })
        return jsonify([c for c in ontologies])

    @app.route('/api/columns', methods=["POST"])
    def get_columns():
        if not os.path.exists(instruments):
            os.makedirs(instruments)
        importFile = request.files.get("file", None)
        importFile.save(os.path.join(instruments, importFile.filename))
        df = pd.read_excel(os.path.join(instruments, importFile.filename))
        return jsonify(list(df.columns.values))

    @app.route('/api/instrument', methods=["POST"])
    def import_instrument():
        project_name = request.args.get('projectId', type=str)
        importFile = request.files.get("file", None)
        col = request.args.get("col", None)

        d = json.loads(col)
        exists = db.session.query(Instrument.name).filter_by(name=project_name).first() is not None
        if exists:
            return jsonify("success")
        else:
            if not os.path.exists(instruments):
                os.makedirs(instruments)

            importFile.save(os.path.join(instruments, importFile.filename))
            file_name = os.path.join(instruments, importFile.filename)
            if importFile.filename.split(".")[-1] == "xlsx":
                q = single_column_to_db(file_name, project_name, d[0]['label'], importFile.filename)

                session.add(q)
                session.commit()
                return jsonify("success")

    @app.route('/api/instrument', methods=["GET"])
    def export_file():
        project_name = request.args.get('projectName', type=str)
        format = request.args.get('format', type=str)

        instrument = db.session.query(Instrument).filter_by(name=project_name).all()
        questions = db.session.query(Item).filter_by(instrument_name=project_name).all()
        answers = db.session.query(AnswerOption).filter_by(instrument_name=project_name).all()
        codes = db.session.query(Code).filter_by(instrument_name=project_name).all()

        if not format:
            return jsonify("no format")
        else:
            # if format == "json":
            #     if instrument[0].instrument_type == 'questionnaire':
            #         return jsonify(db_to_fhirJson(project_name, questions, answers, codes))
            #     else:
            #         return jsonify("not implemented yet")

            if format == "xlsxOpal":
                df = export_maelstrom(instrument, questions, codes, instruments)
            elif format == "xlsx":
                df = get_original_xlsx_and_annotations(instrument, questions, codes, instruments)
            else:
                return jsonify("This format is not supported")

            if not os.path.exists("tmp"):
                os.mkdir("tmp")

            if isinstance(df, str):
                return("This format is not supported")
            else:
                df.to_excel("tmp/document.xlsx", index=False)

            return send_from_directory(directory="../tmp", path="document.xlsx", as_attachment=True)

    @app.route('/api/stats/', methods=['GET'])
    def stats_documents():
        json_output = {}
        if os.environ.get('COMMIT_SHA') is None:
            json_output["softwareVersion"] = 'development'
        else:
            json_output["softwareVersion"] = os.environ.get('COMMIT_SHA')
        return jsonify(json_output)

    @app.route('/api/instrumentType', methods=['GET'])
    def get_instrumentType():
        project_name = request.args.get('projectName', type=str)
        instrument = db.session.query(Instrument).filter_by(name=project_name).all()
        return jsonify(instrument[0].instrument_type)

    return app
