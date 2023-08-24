from models.Test import Test
from models.Test import Response
from flask import request

def submit_response(id):
    response_info = request.get_json()
    authorized_user = getattr(request, 'authorized_user', None)

    test = Test.objects(id=id).first()

    if authorized_user:
        # check if the logged-in user has already submitted a response
        for r in test.responses:
            if r.user == authorized_user['_id']:
                return 'You have already submitted a response', 400

        if authorized_user['_id'] in test.blocked_users:
            return 'You have already submitted a response', 400

        # add the response with test taker info
        test.responses.append(Response(**response_info, user=authorized_user['_id']))

    # add the response without any test taker info
    test.responses.append(Response(**response_info))

    test.save()
    return '', 200
