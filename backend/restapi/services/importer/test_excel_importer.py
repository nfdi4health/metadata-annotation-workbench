import unittest
import pandas as pd
import json

from restapi.services.importer.import_questionnaire import questionnaire_to_db, get_question_type, question_separator


class MyTestCase(unittest.TestCase):
    def test_get_question_type(self):
        file = "../../../test_resources/opal_excel_template.xlsx"
        df = pd.read_excel(file)
        df = df[["Section", "Question", "Answer", "Answer Type"]]
        data = df.to_json(orient="records")
        parsed = json.loads(data)

        result = []
        for obj in parsed:
            result.append(get_question_type(obj))

        expected = ["Integer", "dateTime", "choice", "choice", "choice", "choice", "open-choice", "boolean", "boolean",
                    "boolean", "string", "string"]
        self.assertEqual(result, expected)  # add assertion here

    def test_question_separator(self):
        file = "../../../test_resources/opal_excel_template.xlsx"
        result = question_separator(file)
        expected = ""

        self.assertEqual(result, expected)  # add assertion here

    def test_excel_to_db(self):
        file = "../../../test_resources/opal_excel_template.xlsx"

        result = questionnaire_to_db(file, name="testname")
        result = ""
        expected = ""

        self.assertEqual(result, expected)  # add assertion here




if __name__ == '__main__':
    unittest.main()
