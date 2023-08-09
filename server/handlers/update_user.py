from flask import request
from datetime import datetime
from models.User import User

def update_user():
    new_user_info = request.get_json()
    authorized_user = request.authorized_user

    # update the specified user
    user = User.objects(id=authorized_user['_id']).first()
    user.update(**new_user_info, updated_on=datetime.now())
    return '', 200
