from flask import request, Response
from models.Test import Test
from bson import ObjectId

def add_test():
    test_info = request.get_json()
    authorized_user = request.authorized_user

    # add object ids to questions and choices
    for q in test_info['questions']:
        q['_id'] = ObjectId()
        for o in q['options']:
            o['_id'] = ObjectId()

    # add a new test
    test = Test(**test_info, user=authorized_user['_id']).save()
    return Response(test.to_json(), content_type='application/json')
