from flask import request
from models.Test import Test

def delete_test(id):
    authorized_user = request.authorized_user

    # delete the test
    test = Test.objects(id=id, user=authorized_user['_id']).first()
    test.delete()
    return '', 200
