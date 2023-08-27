from flask import request
from models.Test import Test

def update_comment(id, comment_id):
    comment_body = request.get_json()['newComment']
    updated_on = request.get_json()['updated_on']
    authorized_user = request.authorized_user

    # select test to update
    test = Test.objects(id=id).first()

    # find out the index of the comment to update
    comment_to_update = [c for c in test.comments if ((str(c['_id']) == str(comment_id)) & (str(c['user'].id) == authorized_user['_id']))][0]
    comment_index = test.comments.index(comment_to_update)

    # update the comment
    test.comments[comment_index].body = comment_body
    test.comments[comment_index].updated_on = updated_on
    test.save()

    return '', 200
