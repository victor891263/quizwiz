from flask import request
from models.Test import Test

def update_comment(id, comment_id):
    comment_body = request.get_json()
    authorized_user = request.authorized_user

    # select test to update
    test = Test.objects(id=id).first()

    # find out the index of the comment to update
    comment_to_update = [c for c in test.comments if (str(c.id) == comment_id & str(c.user) == authorized_user['_id'])][0]
    comment_index = test.comments.index(comment_to_update)

    # update the comment
    test.comments[comment_index].body = comment_body
    test.save()

    return '', 200
