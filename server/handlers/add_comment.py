from flask import request, Response
from models.Test import Test
from models.Test import Comment
from bson import ObjectId
from datetime import datetime

def add_comment(id):
    request_body = request.get_json()
    authorized_user = request.authorized_user

    test = Test.objects(id=id).first()
    test.comments.append(Comment(
        _id=ObjectId(),
        body=request_body['commentBody'],
        user=authorized_user['_id'],
        created_on=request_body['created_on'],
        updated_on=request_body['updated_on']
    ))
    test.save()

    return '', 200
