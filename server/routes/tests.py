from flask import Blueprint
from decorators.verify_authorization import verify_authorization

# import handlers
from handlers.get_test_with_questions import get_test_with_questions
from handlers.get_test_with_questions_and_responses import get_test_with_questions_and_responses
from handlers.get_test_with_single_response import get_test_with_single_response
from handlers.get_test import get_test
from handlers.get_tests import get_tests
from handlers.submit_response import submit_response
from handlers.add_test import add_test
from handlers.update_test import update_test
from handlers.delete_test import delete_test
from handlers.add_comment import add_comment
from handlers.update_comment import update_comment
from handlers.delete_comment import delete_comment
from handlers.react_test import react_test
from handlers.react_comment import react_comment
from handlers.add_user_to_blocked_list import add_user_to_blocked_list

tests_blueprint = Blueprint('tests', __name__)


# get a test with questions only
@tests_blueprint.route('/tests/<string:id>/questions', methods=['GET'])
def get_test_with_questions(id):
    return get_test_with_questions(id)

# get a test with questions but only a single response
@tests_blueprint.route('/tests/<string:id>/answer', methods=['GET'])
@verify_authorization
def get_test_with_single_response_wrapper(id):
    return get_test_with_single_response(id)

# get a test with questions and responses
@tests_blueprint.route('/tests/<string:id>/responses', methods=['GET'])
@verify_authorization
def get_test_with_questions_and_responses_wrapper(id):
    return get_test_with_questions_and_responses(id)

# submit a response to a test
@tests_blueprint.route('/tests/<string:id>/responses', methods=['PUT'])
def submit_response_wrapper(id):
    return submit_response(id)

# add a user to the block list if the user failed to submit the response in time
@tests_blueprint.route('/tests/<string:id>/expired', methods=['PUT'])
def add_user_to_blocked_list(id):
    return add_user_to_blocked_list(id)

# get a test
@tests_blueprint.route('/tests/<string:id>', methods=['GET'])
def get_test_wrapper(id):
    return get_test(id)

# get all tests
@tests_blueprint.route('/tests', methods=['GET'])
def get_tests_wrapper():
    return get_tests()

# add a new test
@tests_blueprint.route('/tests', methods=['POST'])
@verify_authorization
def add_test_wrapper():
    return add_test()

# update an existing test
@tests_blueprint.route('/tests/<string:id>', methods=['PUT'])
@verify_authorization
def update_test_wrapper(id):
    return update_test(id)

# delete a test
@tests_blueprint.route('/tests/<string:id>', methods=['DELETE'])
@verify_authorization
def delete_test_wrapper(id):
    return delete_test(id)

# write a comment
@tests_blueprint.route('/tests/<string:id>/comments', methods=['POST'])
@verify_authorization
def add_comment_wrapper(id):
    return add_comment(id)

# update a comment
@tests_blueprint.route('/tests/<string:id>/comments/<string:comment_id>', methods=['PUT'])
@verify_authorization
def update_comment_wrapper(id, comment_id):
    return update_comment(id, comment_id)

# delete a comment
@tests_blueprint.route('/tests/<string:id>/comments/<string:comment_id>', methods=['DELETE'])
@verify_authorization
def delete_comment_wrapper(id, comment_id):
    return delete_comment(id, comment_id)

# like a test
@tests_blueprint.route('/tests/<string:id>/like', methods=['PUT'])
@verify_authorization
def react_test_wrapper(id):
    return react_test(id, 'like')

# dislike a test
@tests_blueprint.route('/tests/<string:id>/dislike', methods=['PUT'])
@verify_authorization
def react_test_wrapper(id):
    return react_test(id, 'dislike')

# like a comment
@tests_blueprint.route('/tests/<string:id>/comments/<string:comment_id>/like', methods=['PUT'])
@verify_authorization
def react_comment_wrapper(id, comment_id):
    return react_comment(id, comment_id, 'like')

# dislike a comment
@tests_blueprint.route('/tests/<string:id>/comments/<string:comment_id>/dislike', methods=['PUT'])
@verify_authorization
def react_comment_wrapper(id, comment_id):
    return react_comment(id, comment_id, 'dislike')
