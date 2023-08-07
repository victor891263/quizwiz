import os
from dotenv import load_dotenv
from flask import request, Blueprint
from models.User import User
from decorators.verify_authorization import verify_authorization

load_dotenv()
JWT_SECRET = os.environ['JWT_SECRET']

verify_new_email_blueprint = Blueprint('verify_new_email', __name__)

@verify_new_email_blueprint.route('/verify_new_email/<string:verification_id>', methods=['GET'])
@verify_authorization
def verify_new_email(verification_id):
    authorized_user = request.authorized_user

    # find the user with the currently logged in info and the verification id
    user = User.objects(id=authorized_user['_id'], new_email__token=verification_id).first()
    if not user:
        return 'Invalid verification link', 400

    # change the user's email to the new email and empty the new_email attribute
    user.email.address = user.new_email.address
    user.new_email.address = None
    user.new_email.token = None

    # save changes
    user.save()
    return '', 200
