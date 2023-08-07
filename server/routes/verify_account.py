import os
from dotenv import load_dotenv
from flask import request, Blueprint
import jwt
from models.User import User

load_dotenv()
JWT_SECRET = os.environ['JWT_SECRET']

verify_account_blueprint = Blueprint('verify_account', __name__)

@verify_account_blueprint.route('/verify_account/<string:verification_id>', methods=['GET'])
def verify_account(verification_id):
    unauthorized_user = getattr(request, 'unauthorized_user', None)

    # check if this user is already verified
    if not unauthorized_user:
        return 'Your account has already been verified', 400

    # check if the account with given id and verification id exists
    user = User.objects(id=unauthorized_user['_id'], email__token=verification_id).first()
    if not user:
        return 'Invalid verification link', 400

    # remove the verification id
    user.email.token = None
    user.save()

    # create the new json web token and send it to client
    token = jwt.encode({'_id': str(user.id), 'isVerified': True}, JWT_SECRET, algorithm='HS256')
    return token, 200
