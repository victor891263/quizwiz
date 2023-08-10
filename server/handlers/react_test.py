from flask import request
from models.Test import Test

def react_test(id, type):
    authorized_user_id = request.authorized_user['_id']

    test = Test.objects(id=id).first()

    # if the logged-in user has already liked/disliked the test, remove it. If not, add it.
    if type == 'like':
        if authorized_user_id in test.liked_users:
            test.liked_users.remove(authorized_user_id)
        else:
            test.liked_users.append(authorized_user_id)
    if type == 'dislike':
        if authorized_user_id in test.disliked_users:
            test.disliked_users.remove(authorized_user_id)
        else:
            test.disliked_users.append(authorized_user_id)

    test.save()
    return '', 200
