import json
import unittest

import pandas as pd
from fhir.resources import construct_fhir_element
from fhir.resources.questionnaire import Questionnaire, QuestionnaireItem, QuestionnaireItemAnswerOption

from restapi.services.importer.import_excel import excel_to_fhirQuest, fill_answeroption_item
unittest.util._MAX_LENGTH = 2000

class MyTestCase(unittest.TestCase):
    def test_empty_questionnaire(self):
        file = "../../test_resources/questionnaire_one_question.xlsx"
        result = excel_to_fhirQuest(file)
        expected = Questionnaire(status="draft")

        self.assertEqual(expected, result)  # add assertion here

    def test_nested_empty_questionnaire(self):
        file = "../../test_resources/questionnaire_one_question.xlsx"
        result = excel_to_fhirQuest(file)

        q = Questionnaire(status="draft")
        qi = QuestionnaireItem(type="group", linkId="0")
        qi.item = []
        qj = QuestionnaireItem(type="group", linkId="1")
        qj.item = []

        qi.item = [qj]
        q.item = [qi]

        self.assertEqual(q, result)  # add assertion here

    def test_questionnaire_with_data(self):
        file = "../../test_resources/questionnaire_one_question.xlsx"
        result = excel_to_fhirQuest(file)

        # initializing
        q = Questionnaire(status="draft")
        qi = QuestionnaireItem(type="group", linkId="0")
        qi.item = []

        #data import
        df = pd.read_excel(file)
        df = df[["Section", "Question", "Answer", "Answer Type"]]
        data = df.to_json(orient="records")
        parsed = json.loads(data)

        #mapping data into questionnaire
        qi.text = parsed[0]["Section"]
        q.item = [qi]

        self.assertEqual(q, result)  # add assertion here

    def test_nested_questionnaire_with_data(self):
        file = "../../test_resources/questionnaire_one_question.xlsx"
        result = excel_to_fhirQuest(file)

        # initializing
        q = Questionnaire(status="draft")
        qi = QuestionnaireItem(type="group", linkId="0")
        qi.item = []
        qj = QuestionnaireItem(type="group", linkId="1")
        qj.item = []
        linkId = 2

        # data import
        df = pd.read_excel(file)
        df = df[["Section", "Question", "Answer", "Answer Type"]]
        data = df.to_json(orient="records")
        parsed = json.loads(data)

        # mapping data into questionnaire
        qj.text = parsed[0]["Section"]
        qj.type = parsed[0]["Answer Type"]
        qj.linkId = str(linkId)
        linkId += 1

        qi.item = [qj]
        q.item = [qi]

        self.assertEqual(q, result)  # add assertion here

    def test_nested_questionnaire_with_data(self):
        file = "../../test_resources/test_questionnaire_multiple_sections.xlsx"
        result = excel_to_fhirQuest(file)
        f = open('../../test_resources/test_questionnaire_multiple_sections_result.json', )
        d = json.load(f)

        expected = construct_fhir_element('Questionnaire', d)
        f.close()

        self.assertEqual(expected, result)

    def test_nested_questionnaire_with_data_complex(self):
        file = "../../test_resources/test_questionnaire_multiple_questions.xlsx"
        result = excel_to_fhirQuest(file)
        f = open('../../test_resources/test_questionnaire_multiple_questions_result.json', )
        d = json.load(f)

        expected = construct_fhir_element('Questionnaire', d)
        f.close()
        print("expected: ", expected)
        print("resultde: ", result)
        self.assertEqual(expected, result)

    def test_answer_type(self):
        file = "../../test_resources/test_questionnaire_multiple_questions.xlsx"
        result = excel_to_fhirQuest(file)
        f = open('../../test_resources/test_questionnaire_multiple_questions_result.json', )
        d = json.load(f)

        expected = construct_fhir_element('Questionnaire', d)
        f.close()
        self.assertEqual(expected, result)

    def test_fill_answeroptions(self):
        text = "test"
        result = fill_answeroption_item(text)
        expected = QuestionnaireItemAnswerOption(valueString=text)
        self.assertEqual(expected, result)

    def test_answeroptions(self):
        file = "../../test_resources/test_questionnaire_answeroptions.xlsx"
        result = excel_to_fhirQuest(file)
        f = open('../../test_resources/test_questionnaire_answeroptions_result.json', )
        d = json.load(f)

        expected = construct_fhir_element('Questionnaire', d)
        f.close()
        print("exp", expected)
        print("res", result)
        self.assertEqual(expected, result)

    # def test_answeroptions_export(self):
    #     file = "../../test_resources/test_questionnaire.xlsx"
    #     result = excel_to_fhirQuest(file)
    #     f = open('../../test_resources/test_questionnaire_answeroptions_result.json', )
    #     d = json.load(f)
    #
    #     expected = construct_fhir_element('Questionnaire', d)
    #
    #     with open('test.json', 'w') as fp:
    #         json.dump(expected, fp)
    #
    #     f.close()
    #     print("exp", expected)
    #     print("res", result)
    #     self.assertEqual(expected, result)



if __name__ == '__main__':
    unittest.main()
