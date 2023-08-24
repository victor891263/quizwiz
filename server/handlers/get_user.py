from models.User import User
from models.Test import Test

def get_user(id):
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

    # get the info of the specified user
    user = User.objects(id=id).exclude('password', 'email__token', 'new_email__token').first()

    # send error message if user doesn't exist
    if not user:
        return 'This user does not exist', 404

    # get all tests submitted by the specified user
    tests = Test.objects(user=id).aggregate(*pipeline)

    return {
        'user_details': user.to_json(),
        'quizzes': tests.to_json()
    }