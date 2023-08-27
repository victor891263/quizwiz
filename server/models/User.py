from mongoengine import Document, EmbeddedDocument, IntField, StringField, EmailField, EmbeddedDocumentField, URLField,DateTimeField
from datetime import datetime

class Email(EmbeddedDocument):
    address = EmailField(required=True, max_length=50)
    token = StringField()

class NewEmail(EmbeddedDocument):
    address = EmailField(max_length=50)
    token = StringField()

class User(Document):
    email = EmbeddedDocumentField(Email)
    new_email = EmbeddedDocumentField(NewEmail)
    password = StringField(required=True, min_length=1, max_length=200)
    username = StringField(min_length=1, max_length=50)
    name = StringField(min_length=1, max_length=50)
    about = StringField(min_length=1, max_length=300)
    img = URLField(min_length=1, max_length=100)
    link = URLField(min_length=1, max_length=100)
    recovery_token = StringField()
    created_on = IntField()
    updated_on = IntField()
