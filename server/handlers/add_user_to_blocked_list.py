from models.Test import Test
from flask import request

def add_user_to_blocked_list(id):
    authorized_user = getattr(request, 'authorized_user', None)

    if authorized_user:
        test = Test.objects(id=id).first()
        test.blocked_users.append(authorized_user['_id'])
        test.save()

    return '', 200