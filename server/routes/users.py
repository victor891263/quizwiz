from flask import Blueprint, request
from models.User import User
from decorators.verify_authorization import verify_authorization

users_blueprint = Blueprint('users', __name__)

@users_blueprint.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    user = User.objects(id=id).exclude('password').first()
    return user.to_json()

@users_blueprint.route('/users', methods=['POST'])
@verify_authorization
def update_user():
    new_user_info = request.get_json()
    authorized_user = request.authorized_user

    # update the specified user
    user = User.objects(id=authorized_user['_id']).first()
    user.update(**new_user_info)
    return '', 200

@users_blueprint.route('/users', methods=['DELETE'])
@verify_authorization
def delete_user():
    authorized_user = request.authorized_user

    # delete the specified user
    user = User.objects(id=authorized_user['_id']).first()
    user.delete()
    return '', 200
