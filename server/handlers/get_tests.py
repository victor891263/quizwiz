from flask import request, Response, jsonify
import json
from models.Test import Test
from bson import json_util

def get_tests():
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
                    "username": "$user.username",
                    "img": "$user.img"
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

    # get query parameters
    keyword = request.args.get('keyword')
    tags = request.args.get('tags')

    # build filters
    query_filters = {}
    if keyword:
        query_filters['title__icontains'] = keyword.strip()
    if tags:
        query_filters['tags__in'] = json.loads(tags)

    # get all tests and apply filters
    tests = Test.objects(**query_filters).aggregate(pipeline)

    return Response(json_util.dumps(tests), content_type='application/json')
