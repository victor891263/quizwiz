from flask import request
from models.Test import Test
from models.Test import Comment

def add_comment(id):
    comment_body = request.get_json()
    authorized_user = request.authorized_user

    test = Test.objects(id=id).first()
    test.comments.append(Comment(body=comment_body, user=authorized_user['_id']))
    test.save()

    return test.to_json()
