from flask import request
import json
from models.Test import Test

def get_tests():
    keyword = request.args.get('keyword')
    keyword = keyword.strip() if keyword else ''

    tags = request.args.get('tags')
    tags = json.loads(tags) if tags else []

    # this pipeline handles population of user and conversion of values of attributes of list types to their lengths
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
            "$project": {
                "_id": 1,
                "title": 1,
                "description": 1,
                "tags": 1,
                "user": {
                    "_id": "$user._id",
                    "name": "$user.name"
                },
                "questions": {"$size": "$questions"},
                "responses": {"$size": "$responses"},
                "comments": {"$size": "$comments"},
                "liked_users": {"$size": "$liked_users"},
                "disliked_users": {"$size": "$disliked_users"},
                "created_on": 1,
                "updated_on": 1
            }
        }
    ]

    # get all tests and apply filters
    tests = Test.objects(title__icontains=keyword, tags__in=tags).aggregate(*pipeline)
    return tests.to_json()
