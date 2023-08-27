from flask import Blueprint
import os
from dotenv import load_dotenv
from decorators.verify_authorization import verify_authorization

# import handlers
from handlers.register_user import register_user
from handlers.get_user import get_user
from handlers.update_user import update_user
from handlers.stop_update_user_email import stop_update_user_email
from handlers.update_user_email import update_user_email
from handlers.update_user_password import update_user_password
from handlers.delete_user import delete_user

# load stuff from env file
load_dotenv()
JWT_SECRET = os.environ['JWT_SECRET']
CLIENT_URL = os.environ['CLIENT_URL']

users_blueprint = Blueprint('users', __name__)

# register user account creation endpoint
@users_blueprint.route('/users', methods=['POST'])
def register_user_wrapper():
    return register_user()

# get a profile
@users_blueprint.route('/users/<string:id>', methods=['GET'])
def get_user_wrapper(id):
    return get_user(id)

# update authorized user's profile
@users_blueprint.route('/users', methods=['PUT'])
@verify_authorization
def update_user_wrapper():
    return update_user()

# stop updating email
@users_blueprint.route('/users/email', methods=['DELETE'])
@verify_authorization
def stop_update_user_email_wrapper():
    return stop_update_user_email()

# update authorized user's email
@users_blueprint.route('/users/email', methods=['PUT'])
@verify_authorization
def update_user_email_wrapper():
    return update_user_email()

# update authorized user's password
@users_blueprint.route('/users/password', methods=['PUT'])
@verify_authorization
def update_user_password_wrapper():
    return update_user_password()

# delete authorized user's profile
@users_blueprint.route('/users', methods=['DELETE'])
@verify_authorization
def delete_user_wrapper():
    return delete_user()
