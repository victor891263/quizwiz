import bcrypt
from flask import request
from datetime import datetime
from models.User import User

def update_user_password():
    passwords = request.get_json()
    authorized_user = request.authorized_user

    # check if the given password matches with the one in the database. If it doesn't, don't proceed
    user = User.objects(id=authorized_user['_id']).first()
    is_password_valid = bcrypt.checkpw(passwords['currentPassword'].encode('utf-8'), user.password.encode('utf-8'))
    if not is_password_valid:
        return 'Wrong password', 400

    # hash the password to make it complex and unreadable
    salt = bcrypt.gensalt(10)
    hashed_new_password = bcrypt.hashpw(passwords['newPassword'].encode('utf-8'), salt).decode('utf-8')

    # update the password
    user.password = hashed_new_password
    user.updated_on = datetime.now()
    user.save()
    return '', 200
