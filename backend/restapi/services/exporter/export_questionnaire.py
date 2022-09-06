import os

import pandas as pd


def get_answer_type(question, answer):
    answertype = question.type
    questionanswer = None

    if question.type == "choice" or question.type == "open-choice":
        answertype = None
    if question.type == "string" or "Other" in answer.text:
        answertype = "free text"
    if question.type == "boolean":
        answertype = None
    if question.type == "Integer" or answer.text == "[number]":
        answertype = "integral"
        questionanswer = "[number]"
    if "DD/MM/20YY" in question.text or "DD/MM/YYYY" in question.text or "DD/MM/YYYY" in answer.text or "DD/MM/20YY" in answer.text:
        questionanswer = "DD/MM/YYYY"
        answertype = "DateTime"

    return answertype, questionanswer


def get_question_type(question):
    answertype = question.type
    questionanswer = None

    if question.type == "choice" or question.type == "open-choice":
        answertype = None
    if question.type == "string":
        answertype = "free text"
    if question.type == "boolean":
        answertype = None
    if question.type == "Integer":
        answertype = "integral"
        questionanswer = "[number]"
    if "DD/MM/20YY" in question.text or "DD/MM/YYYY" in question.text:
        questionanswer = "DD/MM/YYYY"
        answertype = "DateTime"

    return answertype, questionanswer


def get_codes(linkId, codes):
    codelist = ""
    for ele in codes:
        if ele.code_linkId == linkId:
            if codelist == "":
                codelist = ele.code
            else:
                codelist = codelist + "; " + ele.code
    return codelist



def db_to_df(questions, answers, codes):
    result = []

    for question in questions:
        # choice questions have answers
        if question.type == "choice" or question.type == "open-choice":
            counter = "first answer"  # only the first answer has a question text
            for answer in answers:
                if question.linkId == answer.item_linkId:
                    if counter == "first answer":
                        questiontext = question.text
                        linkId = question.linkId
                        codelist = get_codes(linkId, codes)
                        counter = "not first answer"
                    else:
                        questiontext = None
                        codelist = None

                    answertype, questionanswer = get_answer_type(question, answer)
                    temp = {"Section": question.section, "Question": questiontext, "Answer": answer.text,
                            "Answer Type": answertype, "Code": codelist}
                    result.append(temp)

        # all other questions don’t have answers
        else:
            answertype, questionanswer = get_question_type(question)
            linkId = question.linkId
            codelist = get_codes(linkId, codes)
            temp = {"Section": question.section, "Question": question.text, "Answer": questionanswer,
                    "Answer Type": answertype, "Code": codelist}
            result.append(temp)

        df = pd.json_normalize(result)

    return df


def db_to_fhirJson(project_name, questions, answers, codes):
    d = {
        "resourceType": "Questionnaire",
        "status": "draft",
        "item": []
    }
    item = {}

    for question in questions:
        if item:
            d["item"].append(item)
            item = {}
        answerOption = []
        codelist = get_codes(question.linkId, codes)
        item = {"linkId": question.linkId, "text": question.text, "type": question.type, "code": codelist}

        if question.type == "choice":
            newdict = {}
            for answer in answers:
                if question.linkId == answer.item_linkId:
                    newdict["valueString"] = answer.text
                    answerOption.append(newdict.copy())
            item["answerOption"] = answerOption

    return d


# def db_to_fhirJson(project_name, questionJson):
#
#     d = {
#         "resourceType" : "Questionnaire",
#         "status" : "draft",
#         "item" : []
#     }
#     item = {}
#
#     for element in questionJson:
#         if item:
#             d["item"].append(item)
#             item = {}
#         answerOption = []
#         item = {"linkId": element["linkId"], "text" : element["text"], "type": element["dtype"], "code": element["code"]}
#
#         if element["dtype"] == "choice":
#             newdict = {}
#             questionQuery = db.session.query(AnswerOption).filter_by(choiceQuestion_linkId=element["linkId"]).all()
#             answerOptions = [*map(AnswerOption_serializer, questionQuery)]
#             for option in answerOptions:
#                 newdict["valueString"] = option["text"]
#                 answerOption.append(newdict.copy())
#             item["answerOption"] = answerOption
#
#     # with open("testdata.json", "w") as outfile:
#     #     outfile.write(json.dumps(d, indent=4))
#
#     #quest = construct_fhir_element('Questionnaire', d)
#     return d
# helper function for converting FHIR JSON to Excel
def makeDictTemp(item, result):
    dictTemp = {}
    if item['type'] == 'choice':
        firstAnswer = "true"
        for answerOption in item['answerOption']:
            dictTemp = {}
            dictTemp['Section'] = None
            dictTemp['Question'] = None
            dictTemp['Answer'] = list(answerOption.values())[0]
            dictTemp['Answer Type'] = None
            if firstAnswer == "true":
                dictTemp['Question'] = item['text']
                firstAnswer = "false"
            result.append(dictTemp)
    else:
        dictTemp['Section'] = None
        dictTemp['Question'] = item['text']
        dictTemp['Answer'] = None
        dictTemp['Answer Type'] = item['type']

        if item['type'] == "Integer":
            dictTemp['Answer Type'] = "integral"
        elif item['type'] == "dateTime":
            dictTemp['Answer Type'] = "DateTime"

        if dictTemp['Answer Type'] == "free text":
            dictTemp['Answer'] = None
        elif dictTemp['Answer Type'] == "DateTime":
            dictTemp['Answer'] = "DD/MM/202Y"
        elif dictTemp['Answer Type'] == "integral":
            dictTemp['Answer'] = "[number]"

        result.append(dictTemp)
    return result


# converting FHIR JSON to Excel
def fhir_to_excel(fhir_list):
    result = []
    for item in fhir_list["item"]:
        result = makeDictTemp(item, result)
    df = pd.json_normalize(result)
    df.to_excel("testexcel.xlsx", index=False)
    return

