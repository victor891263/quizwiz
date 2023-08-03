import os
from flask import Flask, make_response, request
from flask_cors import CORS
import mongoengine
from dotenv import load_dotenv
import jwt

# import routes
from routes.users import users_blueprint

# load stuff from env file
load_dotenv()
DATABASE_URI = os.environ['DATABASE_URI']
JWT_SECRET = os.environ['JWT_SECRET']

# initialize API
app = Flask(__name__)
CORS(app)

# catch all errors
@app.errorhandler(Exception)
def catch_error(error):
    error_message = str(error) if error.args else 'Unknown error occurred'
    return make_response(error_message, 500)

# connect to database
mongoengine.connect(host=DATABASE_URI)

# disconnect from database if API stops running
@app.teardown_appcontext
def disconnect_db(error):
    mongoengine.disconnect()
    if error:
        print(error)

# execute this before every request is handled
@app.before_request
def get_user():
    # Get the Authorization header from the request
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1] # extract the token
        try:
            request.authorized_user = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return 'Session expired', 401
        except jwt.InvalidTokenError:
            return 'Invalid token', 401

# register blueprints/routes
app.register_blueprint(users_blueprint)
