from flask import request
from models.Test import Test
from bson import ObjectId

def react_comment(id, comment_id, type):
    authorized_user_id = request.authorized_user['_id']

    test = Test.objects(id=id).first()

    # find out the index of the comment to update
    comment_to_react = [c for c in test.comments if str(c['_id']) == comment_id][0]
    comment_index = test.comments.index(comment_to_react)

    # if the logged-in user has already liked/disliked the comment, remove it. If not, add it.

    if type == 'like':
        if ObjectId(authorized_user_id) in test.comments[comment_index].liked_users:
            # for some reason, when the liked_users list becomes empty, the liked_users attribute itself is removed from the document. This issue of mongoengine has not been fixed yet
            print('dont do anything')
        else:
            test.comments[comment_index].liked_users.append(ObjectId(authorized_user_id))
    if type == 'dislike':
        if ObjectId(authorized_user_id) in test.comments[comment_index].disliked_users:
            # for some reason, when the disliked_users list becomes empty, the liked_users attribute itself is removed from the document. This issue of mongoengine has not been fixed yet
            print('dont do anything')
        else:
            test.comments[comment_index].disliked_users.append(ObjectId(authorized_user_id))

    test.save()
    return '', 200