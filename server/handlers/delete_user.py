from flask import request
from models.User import User

def delete_user():
    authorized_user = request.authorized_user

    # delete the specified user
    user = User.objects(id=authorized_user['_id']).first()
    user.delete()
    return '', 200
