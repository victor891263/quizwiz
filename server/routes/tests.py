from flask import Blueprint

# import handlers
from handlers.get_test import get_test
from handlers.get_tests import get_tests

tests_blueprint = Blueprint('tests', __name__)

# get a test
@tests_blueprint.route('/tests/<string:id>', methods=['GET'])
def get_test_wrapper(id):
    return get_test(id)

# get all tests
@tests_blueprint.route('/tests', methods=['GET'])
def get_tests_wrapper():
    return get_tests()

# add a new test
@tests_blueprint.route('/tests/<string:id>', methods=['GET'])
def get_test_wrapper(id):
    return get_test(id)
