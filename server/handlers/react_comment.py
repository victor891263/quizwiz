from flask import request
from models.Test import Test

def react_comment(id, comment_id, type):
    authorized_user_id = request.authorized_user['_id']

    test = Test.objects(id=id).first()

    # find out the index of the comment to update
    comment_to_react = [c for c in test.comments if str(c.id) == comment_id][0]
    comment_index = test.comments.index(comment_to_react)

    # if the logged-in user has already liked/disliked the comment, remove it. If not, add it.
    if type == 'like':
        if authorized_user_id in test.comments[comment_index].liked_users:
            test.comments[comment_index].liked_users.remove(authorized_user_id)
        else:
            test.comments[comment_index].liked_users.append(authorized_user_id)
    if type == 'dislike':
        if authorized_user_id in test.comments[comment_index].disliked_users:
            test.comments[comment_index].disliked_users.remove(authorized_user_id)
        else:
            test.comments[comment_index].disliked_users.append(authorized_user_id)

    test.save()
    return '', 200