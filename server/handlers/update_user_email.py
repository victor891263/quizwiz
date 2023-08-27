import os
from flask import request
import secrets
from dotenv import load_dotenv
from mongoengine import Q
from models.User import User, NewEmail
from utilities.send_email import send_email

# load stuff from env file
load_dotenv()
CLIENT_URL = os.environ['CLIENT_URL']

def update_user_email():
    new_email = request.get_json()['newEmail']
    authorized_user = request.authorized_user

    # check if the email has already been taken and if it has been, don't proceed
    existing_user = User.objects(Q(email__address=new_email) | Q(new_email__address=new_email)).first()
    if existing_user is not None:
        return 'An account with a given email already exists', 400

    # generate verification id
    random_id = secrets.token_hex(32)

    # add the information to the user document that the user is trying to update their email, along with email verification id
    user = User.objects(id=authorized_user['_id']).first()
    user.new_email = NewEmail(address=new_email, token=random_id)
    user.save()

    print(new_email)

    # send a verification email to the provided email address
    send_email(f'Visit this link to finish updating your email: {CLIENT_URL}/verify/{random_id}?mail=true', '[Quizwiz] Verify your new email', [new_email])

    print('mail success')

    return '', 200
