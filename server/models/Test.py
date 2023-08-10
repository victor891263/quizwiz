from datetime import datetime
from mongoengine import Document, EmbeddedDocument, StringField, IntField, BooleanField, ListField, EmbeddedDocumentField, ReferenceField, ObjectIdField, DateTimeField
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
    elapsed_time = IntField(max_value=3600, min_value=1)

class Response(EmbeddedDocument):
    user = ReferenceField(User, required=True)
    answers = ListField(EmbeddedDocumentField(Answer))
    total_elapsed_time = IntField(max_value=3600, min_value=1)

class Comment(EmbeddedDocument):
    user = ReferenceField(User, required=True)
    body = StringField(required=True, max_length=500)
    liked_users = ListField(ReferenceField(User))
    disliked_users = ListField(ReferenceField(User))

class TimeLimit(EmbeddedDocument):
    time_limit = IntField(max_value=60, min_value=1)
    apply_individually = BooleanField()

class Test(Document):
    questions = ListField(EmbeddedDocumentField(Question))
    responses = ListField(EmbeddedDocumentField(Response))
    comments = ListField(EmbeddedDocumentField(Comment))
    user = ReferenceField(User)
    liked_users = ListField(ObjectIdField())
    disliked_users = ListField(ObjectIdField())
    tags = ListField(StringField(max_length=100))
    title = StringField(required=True, max_length=250)
    description = StringField(required=True, max_length=1000)
    created_on = DateTimeField(default=datetime.now())
    updated_on = DateTimeField(default=datetime.now())
