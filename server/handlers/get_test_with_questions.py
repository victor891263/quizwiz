from models.Test import Test
from flask import Response

def get_test_with_questions(id):
    test = Test.objects(id=id).exclude('responses', 'comments', 'user', 'liked_users', 'disliked_users')

    # send error message if the test with the id does not exist
    if not test:
        return 'This test does not exist', 404

    return Response(test.to_json(), content_type='application/json')
