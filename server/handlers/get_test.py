from models.Test import Test
from flask import request

def get_test(id):
    # this pipeline handles population of user and comment info
    pipeline = [
        {
            "$lookup": {
                "from": "user",
                "localField": "user",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$comments"
        },
        {
            "$lookup": {
                "from": "user",
                "localField": "comments.user",
                "foreignField": "_id",
                "as": "comments.user"
            }
        },
        {
            "$unwind": "$comments.user"
        },
        {
            "$project": {
                "_id": 1,
                "user": {
                    "_id": 1,
                    "username": "$user.username",
                    "img": "$user.img"
                },
                "questions": {"$size": "$questions"},
                "responses": {"$size": "$responses"},
                "time_limit": 1,
                "liked_users": 1,
                "disliked_users": 1,
                "comments": {
                    "_id": 1,
                    "body": "$comments.body",
                    "user": {
                        "_id": 1,
                        "username": "$comments.user.username",
                        "img": "$comments.user.img"
                    },
                    "liked_users": 1,
                    "disliked_users": 1
                },
                "tags": 1,
                "title": 1,
                "blocked_users": 1,
                "description": 1,
                "created_on": 1,
                "updated_on": 1
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "user": {"$first": "$user"},
                "questions": {"$first": "$questions"},
                "responses": {"$first": "$responses"},
                "time_limit": {"$first": "$time_limit"},
                "liked_users": {"$first": "$liked_users"},
                "disliked_users": {"$first": "$disliked_users"},
                "comments": {"$push": "$comments"},
                "tags": {"$first": "$tags"},
                "title": {"$first": "$title"},
                "blocked_users": {"$first": "$blocked_users"},
                "description": {"$first": "$description"},
                "created_on": {"$first": "$created_on"},
                "updated_on": {"$first": "$updated_on"},
            }
        }
    ]

    authorized_user = getattr(request, 'authorized_user', None)

    # retrieve the specified test
    test = Test.objects(id=id).aggregate(*pipeline)

    # send error message if the test with the id does not exist
    if not test:
        return 'This test does not exist', 404

    test_json = test.to_json()

    # check if the currently logged-in user has already submitted a response
    if authorized_user:
        for r in test.responses:
            if r.user['$oid'] == authorized_user['_id']:
                test_json['is_response_submitted'] = True

    return test_json
