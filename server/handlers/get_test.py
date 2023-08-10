from models.Test import Test

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
                    "email": "$user.email"
                },
                "questions": 1,
                "responses": 1,
                "liked_users": 1,
                "disliked_users": 1,
                "comments": {
                    "body": "$comments.body",
                    "user": {
                        "_id": 1,
                        "email": "$comments.user.email"
                    },
                    "liked_users": 1,
                    "disliked_users": 1
                },
                "tags": 1,
                "title": 1,
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
                "liked_users": {"$first": "$liked_users"},
                "disliked_users": {"$first": "$disliked_users"},
                "comments": {"$push": "$comments"},
                "tags": {"$first": "$tags"},
                "title": {"$first": "$title"},
                "description": {"$first": "$description"},
                "created_on": {"$first": "$created_on"},
                "updated_on": {"$first": "$updated_on"},
            }
        }
    ]

    # retrieve the specified test
    test = Test.objects(id=id).aggregate(*pipeline)

    # send error message if the test with the id does not exist
    if not test:
        return 'This test does not exist', 404

    return test.to_json()
