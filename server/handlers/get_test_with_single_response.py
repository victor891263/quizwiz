from models.Test import Test
from flask import request, jsonify
import json
from bson import json_util

def get_test_with_single_response(id):
    pipeline = [
        {
            "$unwind": {
                "path": "$responses",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$lookup": {
                "from": "user",
                "localField": "responses.user",
                "foreignField": "_id",
                "as": "responses.user"
            }
        },
        {
            "$unwind": {
                "path": "$responses.user",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 1,
                "questions": 1,
                "responses": {
                    "_id": 1,
                    "user": {
                        "_id": 1,
                        "username": "$responses.user.username",
                        "img": "$responses.user.img"
                    },
                    "answers": 1,
                    "elapsed_time": 1,
                    "created_on": 1
                },
                "time_limit": 1,
                "title": 1,
                "created_on": 1,
                "updated_on": 1
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "questions": {"$first": "$questions"},
                "responses": {"$push": "$responses"},
                "time_limit": {"$first": "$time_limit"},
                "title": {"$first": "$title"},
                "created_on": {"$first": "$created_on"},
                "updated_on": {"$first": "$updated_on"}
            }
        }
    ]

    authorized_user = request.authorized_user

    # retrieve the specified test
    test = Test.objects(id=id).aggregate(pipeline)

    # send error message if the test with the id does not exist
    if not test:
        return 'This test does not exist', 404

    def calculate_percentage(quiz, option_id):
        total = len(quiz['responses'])  # number of total responses OR number of users who made a response
        count = sum(1 for r in quiz['responses'] if any(a['choice_id']['$oid'] == option_id for a in r['answers'])) # find the number of responses where the specific choice was selected OR the number of users who picked the specified choice
        return round((count / total) * 100)  # calculate the percentage

    test_dict = json.loads(json_util.dumps(list(test)[0]))

    # if responses are a list of empty objects, change them into an empty list
    if test_dict['responses'][0]['user'] == {}:
        test_dict['responses'] = []

    # add the pick rate of each option of each question
    for q in test_dict['questions']:
        for o in q['options']:
            o['pick_rate'] = calculate_percentage(test_dict, o['_id']["$oid"])

    # calculate how many questions each user answered correctly and construct a list out of them
    correctness_of_responses = []
    for r in test_dict['responses']:
        correctly_answered_questions = sum(
            1 for a in r['answers'] if any(
                o['is_correct'] for q in test_dict['questions'] if q['_id']["$oid"] == a["question_id"]["$oid"] for o in q['options']
            )
        )
        correctness = {
            '_id': r['_id'],
            'user': r['user'],
            'correctness': round((correctly_answered_questions / len(test_dict['questions'])) * 100)
        }
        correctness_of_responses.append(correctness)

    # assign the list to the test object
    test_dict['correctness_of_responses'] = correctness_of_responses

    # remove all other responses except the one made by the logged-in user
    test_dict['responses'] = [r for r in test_dict['responses'] if r['user']['_id']["$oid"] == authorized_user['_id']]

    return jsonify(test_dict)
