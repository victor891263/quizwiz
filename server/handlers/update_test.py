from flask import request
from datetime import datetime
from models.Test import Test

def update_test(id):
    new_test_info = request.get_json()
    authorized_user = request.authorized_user

    # update the test
    test = Test.objects(id=id, user=authorized_user['_id']).first()
    test.update(**new_test_info, updated_on=datetime.now())
    return '', 200
