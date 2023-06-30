import os
import uuid

from parser import ParserError

import pandas as pd
import requests
from flask import Flask, send_from_directory
from flask import jsonify, request, json, abort
from flask_cors import CORS
from sqlalchemy import insert
from urllib.parse import quote

from restapi.models import db
from restapi.models.models import Item, AnswerOption, Instrument, Code
from restapi.services.exporter.export_maelstrom import \
    export_maelstrom_annotations_opal, export_maelstrom_annotations_opal_only_annotations
from restapi.services.exporter.export_questionnaire import db_to_fhirJson, db_to_df
from restapi.services.exporter.export_xlsx import get_original_xlsx_and_annotations, \
    export_maelstrom_annotations_simple, export_maelstrom_annotations_simple_only_annotations, get_only_annotations
from restapi.services.filter_search_results import filter_class, filter_maelstrom_domains, filter_ontology_information
from restapi.services.importer.import_xlsx_and_csv import single_column_to_db
from restapi.services.importer.import_maelstrom import import_maelstrom
from restapi.services.importer.import_questionnaire import questionnaire_to_db
from restapi.database import init_db, session, engine
from restapi.services.preprocess_sentence import preprocess_sentence


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    init_db()

    DB_USERNAME = os.environ.get("DB_USERNAME")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_HOST = os.environ.get("DB_HOST")
    DATABASE_URL = "postgresql://" + DB_USERNAME + ":" + DB_PASSWORD + "@" + DB_HOST + ":5432/" + DB_USERNAME
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config['JSON_SORT_KEYS'] = False
    app.config['COMMIT_SHA'] = os.environ.get('COMMIT_SHA', default="development")
    db.init_app(app)

    ols = os.environ.get('API_SEMLOOKP')
    INSTRUMENTS = os.environ.get('INSTRUMENTS')
    API_PREDICT = os.environ.get('API_PREDICT')

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
        if len(query) == 1:
            return jsonify([query[0].name])
        else:
            return jsonify([tuple(row) for row in query])

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

        return(obj["_embedded"]["terms"][0]["label"])

    @app.route('/api/ols/ontology', methods=["GET"])
    def api_ols_ontology():
        q = request.args.get('iri', type=str)

        payload = {'q': quote(quote(q, safe='~()*!\''), safe='~()*!\'')}
        r = requests.get(ols + 'ontologies/terms/', params=payload)
        obj = r.json()

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

    @app.route('/api/instrument/columns', methods=["POST"])
    def get_columns():
        file_to_import = request.files.get("file", None)

        if not os.path.exists(INSTRUMENTS + "/tmp"):
            os.makedirs(INSTRUMENTS + "/tmp")

        file_to_import.save(INSTRUMENTS + "/tmp/" + file_to_import.filename)

        if file_to_import.filename.split(".")[-1] == "xlsx":
            df = pd.read_excel(INSTRUMENTS + "/tmp/" + file_to_import.filename)
        if file_to_import.filename.split(".")[-1] == "csv":
            df = pd.read_csv(INSTRUMENTS + "/tmp/" + file_to_import.filename)

        try:
            os.remove(INSTRUMENTS + "/tmp/" + file_to_import.filename)
        except OSError:
            pass

        return jsonify(list(df.columns.values))

    @app.route('/api/instrument', methods=["POST"])
    def import_instrument():
        project_id = request.args.get('projectId', type=str)
        file_to_import = request.files.get("file", None)
        column_to_annotate = request.args.get("col", None)

        original_filename = os.path.join(file_to_import.filename)
        file_to_import.save(os.path.join(INSTRUMENTS, original_filename))
        file_id = uuid.uuid1()
        unique_filename = os.path.join(str(file_id) + "." + file_to_import.filename.split(".")[-1])

        try:
            os.rename(os.path.join(INSTRUMENTS, original_filename), os.path.join(INSTRUMENTS, unique_filename))
        except OSError:
            pass

        dict_column_to_annotate = json.loads(column_to_annotate)
        exists = db.session.query(Instrument.name).filter_by(name=project_id).first() is not None
        if exists:
            return jsonify("success")
        else:
            if original_filename.split(".")[-1] == "xlsx":
                instrument_type = "xlsx"
                df = pd.read_excel(os.path.join(INSTRUMENTS, unique_filename))
            if original_filename.split(".")[-1] == "csv":
                instrument_type = "csv"
                df = pd.read_csv(os.path.join(INSTRUMENTS, unique_filename))

            q = single_column_to_db(df, project_id, dict_column_to_annotate[0]['label'], original_filename, instrument_type, unique_filename)

            session.add(q)
            session.commit()
            return jsonify("success")


    def read_file(original_file_format, instrument):
        if original_file_format == "xlsx":
            df = pd.read_excel(os.path.join(INSTRUMENTS, instrument[0].unique_name))
        elif original_file_format == "csv":
            df = pd.read_csv(os.path.join(INSTRUMENTS, instrument[0].unique_name))
        else:
            return jsonify({"error": "No supported format available. Please contact the software developer."})
        return df

    @app.route('/api/instrument', methods=["GET"])
    def export_file():
        project_name = request.args.get('projectName', type=str)
        export_form = request.args.get('exportForm', type=str)
        export_format = request.args.get('exportFormat', type=str)
        export_only_annotations = request.args.get('exportOnlyAnnotations', type=str)

        instrument = db.session.query(Instrument).filter_by(name=project_name).all()
        questions = db.session.query(Item).filter_by(instrument_name=project_name).all()
        answers = db.session.query(AnswerOption).filter_by(instrument_name=project_name).all()
        codes = db.session.query(Code).filter_by(instrument_name=project_name).all()

        original_file_format = instrument[0].original_name.split(".")[-1]

        if not export_form and export_format:
            return jsonify({"error": "Unknown parameter. Please contact the software developer."})
        else:
            # if format == "json":
            #     if instrument[0].instrument_type == 'questionnaire':
            #         return jsonify(db_to_fhirJson(project_name, questions, answers, codes))
            #     else:
            #         return jsonify("not implemented yet")

            if export_form == "opal":
                if export_only_annotations == "true":
                    export_df = export_maelstrom_annotations_opal_only_annotations(questions, codes)
                else:
                    try:
                        df = read_file(original_file_format, instrument)
                    except:
                        abort(500, description="Error reading the original file.")
                    else:
                        export_df = export_maelstrom_annotations_opal(df, instrument, questions, codes)
            elif export_form == "default":
                if export_only_annotations == "true":
                    export_df = get_only_annotations(questions, codes)
                else:
                    try:
                        df = read_file(original_file_format, instrument)
                    except:
                        abort(500, description="Error reading the original file.")
                    else:
                        export_df = get_original_xlsx_and_annotations(df, instrument, questions, codes)
            elif export_form == "simple":
                if export_only_annotations == "true":
                    export_df = export_maelstrom_annotations_simple_only_annotations(questions, codes)
                else:
                    try:
                        df = read_file(original_file_format, instrument)
                    except:
                        abort(500, description="Error reading the original file.")
                    else:
                        export_df = export_maelstrom_annotations_simple(df, instrument, questions, codes)
            else:
                return jsonify({"error": "Unknown form. Please contact the software developer."})

            export_folder = os.path.join(INSTRUMENTS, "export")
            if os.path.exists(export_folder):
                for filename in os.listdir(export_folder):
                    file_path = os.path.join(export_folder, filename)
                    try:
                        if os.path.isfile(file_path):
                            os.unlink(file_path)
                    except Exception as e:
                        print('Failed to delete %s. Reason: %s' % (file_path, e))

            if not os.path.exists(export_folder):
                os.makedirs(export_folder)

            if isinstance(export_df, str):
                return jsonify({"error": "Error during converting the file. Please contact the software developer."})
            else:
                if export_format == "xlsx":
                    export_document_name = "doc.xlsx"
                    export_df.to_excel(os.path.join(export_folder, export_document_name), index=False)
                elif export_format == "csv":
                    export_document_name = "doc.csv"
                    export_df.to_csv(os.path.join(export_folder, export_document_name), index=False)

            return send_from_directory(directory="../" + export_folder, path=export_document_name, as_attachment=True)

    @app.route('/api/stats/', methods=['GET'])
    def stats_documents():
        json_output = {}
        json_output["softwareVersion"] = app.config['COMMIT_SHA']
        return jsonify(json_output)

    @app.route('/api/instrumentType', methods=['GET'])
    def get_instrumentType():
        project_name = request.args.get('projectName', type=str)
        instrument = db.session.query(Instrument).filter_by(name=project_name).all()
        return jsonify(instrument[0].instrument_type)

    @app.route('/api/prediction/predict', methods=['GET'])
    def get_predictions():
        variable = request.args.get('variable', type=str)
        r = requests.get(API_PREDICT + "/predict?variable=" + variable)
        result = r.json()["prediction"][:5]
        return result

    @app.route('/api/auto-annotation', methods=['GET'])
    def auto_annotation():
        projectId = request.args.get('projectId', type=str)
        query = db.session.query(Item).filter_by(instrument_name=projectId).all()

        isInDB = False

        list_of_dicts = [c.as_dict() for c in query]

        for dic in list_of_dicts:
            req = requests.get(API_PREDICT + "/predict?variable=" + dic["text"])
            prediction = req.json()["prediction"][:1]
            prediction_iri = prediction[0]["iri"]

            query_code = db.session.query(Code).filter_by(instrument_name=projectId) \
                .filter_by(code_linkId=dic["linkId"]).all()
            codes = [c.as_dict() for c in query_code]
            for element in codes:
                if prediction_iri == element["code"]:
                    return jsonify('isInDB')
            if not isInDB:
                stmt = (
                    insert(Code).
                    values(code_linkId=dic["linkId"], code=prediction_iri, instrument_name=projectId)
                )
                session.execute(stmt)
                session.commit()
        return

    @app.route('/api/annotations', methods=['DELETE'])
    def remove_all_annotations():
        projectId = request.args.get('projectId', type=str)

        if projectId:
            session.query(Code).filter_by(instrument_name=projectId) \
                .delete()
            session.commit()

        return projectId


    return app
