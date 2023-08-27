from datetime import datetime
from mongoengine import Document, EmbeddedDocument, StringField, IntField, BooleanField, ListField, EmbeddedDocumentField, ReferenceField, ObjectIdField, DateTimeField
from .User import User

class Option(EmbeddedDocument):
    _id = ObjectIdField()
    body = StringField(required=True)
    is_correct = BooleanField(required=True)

class Question(EmbeddedDocument):
    _id = ObjectIdField()
    title = StringField(required=True, max_length=300)
    options = ListField(EmbeddedDocumentField(Option))

class Answer(EmbeddedDocument):
    question_id = ObjectIdField(required=True)
    choice_id = ObjectIdField(required=True)

class Response(EmbeddedDocument):
    _id = ObjectIdField()
    user = ReferenceField(User)
    answers = ListField(EmbeddedDocumentField(Answer))
    elapsed_time = IntField(max_value=60, min_value=1)
    created_on = IntField()

class Comment(EmbeddedDocument):
    _id = ObjectIdField()
    user = ReferenceField(User, required=True)
    body = StringField(required=True, max_length=300)
    liked_users = ListField(ObjectIdField())
    disliked_users = ListField(ObjectIdField())
    created_on = IntField()
    updated_on = IntField()

class Test(Document):
    questions = ListField(EmbeddedDocumentField(Question))
    responses = ListField(EmbeddedDocumentField(Response))
    comments = ListField(EmbeddedDocumentField(Comment))
    time_limit = IntField(max_value=60, min_value=1)
    blocked_users = ListField(ObjectIdField())
    user = ReferenceField(User, required=True)
    liked_users = ListField(ObjectIdField())
    disliked_users = ListField(ObjectIdField())
    tags = ListField(StringField(max_length=50))
    title = StringField(required=True, max_length=60)
    description = StringField(required=True, max_length=500)
    created_on = IntField()
    updated_on = IntField()
