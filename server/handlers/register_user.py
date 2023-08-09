from flask import request
import os
import bcrypt
import secrets
import jwt
from dotenv import load_dotenv
from models.User import User
from utilities.send_email import send_email

# load stuff from env file
load_dotenv()
JWT_SECRET = os.environ['JWT_SECRET']
CLIENT_URL = os.environ['CLIENT_URL']

def register_user():
    user_info = request.get_json()

    # check if there is already a user with the email provided
    existing_user = User.objects(email__address=user_info['email']).first()
    if existing_user is not None:
        return 'An account with a given email already exists', 400

    # hash the password to make it complex and unreadable
    salt = bcrypt.gensalt(10)
    hashed_password = bcrypt.hashpw(user_info['password'].encode('utf-8'), salt).decode('utf-8')

    # generate verification id
    random_id = secrets.token_hex(32)

    # add user to database
    user = User(email={'address': user_info['email'], 'token': random_id}, password=hashed_password).save()

    # send a verification email to the provided email address
    send_email(f'Visit this link to complete the account creation process: {CLIENT_URL}/verify/{random_id}', '[Quizwiz] Verify your email', [user_info['email']])

    # create the json web token and send it to the client
    token = jwt.encode({'_id': str(user.id), 'isVerified': False}, JWT_SECRET, algorithm='HS256')
    return token, 200