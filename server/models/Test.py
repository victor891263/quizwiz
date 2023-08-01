from mongoengine import Document, EmbeddedDocument, StringField, BooleanField, ListField, EmbeddedDocumentField, ReferenceField, ObjectIdField
from .User import User

class Option(EmbeddedDocument):
    body = StringField(required=True)
    is_correct = BooleanField(required=True)

class Question(EmbeddedDocument):
    title = StringField(required=True, max_length=500)
    options = ListField(EmbeddedDocumentField(Option))

class Answer(EmbeddedDocument):
    question_id = ObjectIdField(required=True)
    choice_ids = ListField(ObjectIdField())

class Response(EmbeddedDocument):
    user = ReferenceField(User, required=True)
    answers = ListField(EmbeddedDocumentField(Answer))

class Comment(EmbeddedDocument):
    user = ReferenceField(User, required=True)
    body = StringField(required=True, max_length=500)
    liked_users = ListField(ReferenceField(User))
    disliked_users = ListField(ReferenceField(User))

class Test(Document):
    questions = ListField(EmbeddedDocumentField(Question))
    responses = ListField(EmbeddedDocumentField(Response))
    comments = ListField(EmbeddedDocumentField(Comment))
    user = ReferenceField(User, required=True)
    liked_users = ListField(ObjectIdField())
    disliked_users = ListField(ObjectIdField())


"""
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
            }
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
            "comments": {"$push": "$comments"}
        }
    }
]

try:
    test = Test.objects(id='64c92c6df5bb70561b9abf69').aggregate(*pipeline)
    print(list(test))
except Exception as e:
    print(e)
"""
