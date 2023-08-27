from flask import request
from datetime import datetime
from models.Test import Test
from bson import ObjectId

def update_test(id):
    new_test_info = request.get_json()
    authorized_user = request.authorized_user

    # add object ids to questions and choices if there aren't any
    for q in new_test_info['questions']:
        if not getattr(q, '_id', None):
            q['_id'] = ObjectId()
        for o in q['options']:
            if not getattr(o, '_id', None):
                o['_id'] = ObjectId()

    # update the test
    test = Test.objects(id=id, user=authorized_user['_id']).first()
    test.update(**new_test_info)
    return '', 200
