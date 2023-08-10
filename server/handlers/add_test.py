from flask import request
from models.Test import Test

def add_test():
    test_info = request.get_json()
    authorized_user = request.authorized_user

    # add a new test
    test = Test.objects(**test_info, user=authorized_user['_id']).save()
    return test.to_json()
