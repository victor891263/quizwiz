from flask import Blueprint, request
import os
import bcrypt
import jwt
from dotenv import load_dotenv
from models.User import User

load_dotenv()
JWT_SECRET = os.environ['JWT_SECRET']

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/auth', methods=['GET'])
def authorize():
    user_info = request.get_json()

    # check if the given email exists in the database. If it doesn't, don't proceed
    user = User.objects(email__address=user_info['email']).first()
    if not user:
        return 'No account found with this email', 400

    # check if the given password matches with the one in the database. If it doesn't, don't proceed
    is_password_valid = bcrypt.checkpw(user_info['password'], user.password)
    if not is_password_valid:
        return 'Wrong password', 400

    # create the json web token and send it to the client
    token = jwt.encode({'_id': str(user.id), 'isVerified': True if not user.email.token else False}, JWT_SECRET, algorithm='HS256') # if verification id still exists, that means the user is unverified
    return token, 200
