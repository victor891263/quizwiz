from flask import Blueprint, request
import secrets
import os
from dotenv import load_dotenv
import bcrypt
from models.User import User
from utilities.send_email import send_email

# load stuff from env file
load_dotenv()
CLIENT_URL = os.environ['CLIENT_URL']

recover_account_blueprint = Blueprint('recover_account', __name__)

# user specifies an email address to send password recovery instructions to
@recover_account_blueprint.route('/recover', methods=['POST'])
def send_recovery_instructions():
    email = request.get_json()['email']

    # check if an account exists with the given email
    user = User.objects(email__address=email).first()
    if not user:
        return 'No account with the given email exists', 404

    # generate verification id
    random_id = secrets.token_hex(32)

    # set the recovery id
    user.recovery_token = random_id
    user.save()

    # send the recovery instructions
    send_email(f'Visit this link to reset your password and recover your account: {CLIENT_URL}/reset/{random_id}','[Quizwiz] Recover your account', [user.email.address])

    return '', 200

# user resets their password
@recover_account_blueprint.route('/reset/<string:recovery_id>', methods=['PUT'])
def reset_password(recovery_id):
    new_password = request.get_json()['password']

    # hash the password to make it complex and unreadable
    salt = bcrypt.gensalt(10)
    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

    # find the user with the given recovery id
    user = User.objects(recovery_token=recovery_id).first()
    if not user:
        return 'Invalid recovery link', 400

    # reset password
    user.password = hashed_new_password
    user.save()
    return '', 200
