from models.Test import Test

def get_test_with_questions(id):
    test = Test.objects(id=id).only('_id', 'questions', 'time_limit', 'created_on', 'updated_on')

    # send error message if the test with the id does not exist
    if not test:
        return 'This test does not exist', 404

    return test.to_json()
