from flask import request
from models.User import User, NewEmail

def stop_update_user_email():
    authorized_user = request.authorized_user

    user = User.objects(id=authorized_user['_id']).first()
    user.new_email.address = None
    user.new_email.token = None

    # save changes
    user.save()
    return '', 200