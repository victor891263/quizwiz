from flask import request
from models.Test import Test

def delete_comment(id, comment_id):
    authorized_user = request.authorized_user

    # select test
    test = Test.objects(id=id).first()

    # find out the index of the comment to delete
    comment_to_update = [c for c in test.comments if (str(c.id) == comment_id & str(c.user) == authorized_user['_id'])][0]
    comment_index = test.comments.index(comment_to_update)

    # delete the comment
    test.comments.pop(comment_index)
    test.save()

    return '', 200
