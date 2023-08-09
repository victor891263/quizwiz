from mongoengine import Document, EmbeddedDocument, StringField, EmailField, EmbeddedDocumentField, URLField,DateTimeField
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
    password = StringField(required=True, min_length=1, max_length=100)
    username = StringField(min_length=1, max_length=50)
    name = StringField(min_length=1, max_length=100)
    about = StringField(min_length=1, max_length=500)
    img = URLField(min_length=1, max_length=500)
    link = URLField(min_length=1, max_length=100)
    recovery_token = StringField()
    created_on = DateTimeField(default=datetime.now())
    updated_on = DateTimeField(default=datetime.now())
