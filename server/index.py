import os
from flask import Flask, make_response, request
from flask_cors import CORS
import mongoengine
from dotenv import load_dotenv
import jwt
from flask_mail import Mail

# import routes
from routes.users import users_blueprint
from routes.auth import auth_blueprint
from routes.verify_account import verify_account_blueprint
from routes.verify_new_email import verify_new_email_blueprint
from routes.recover_account import recover_account_blueprint

# load stuff from env file
load_dotenv()
DATABASE_URI = os.environ['DATABASE_URI']
JWT_SECRET = os.environ['JWT_SECRET']
SMTP_PASSWORD = os.environ['SMTP_PASSWORD']
CLIENT_URL = os.environ['CLIENT_URL']

# initialize API
app = Flask(__name__)
CORS(app)

# catch all errors
@app.errorhandler(Exception)
def catch_error(error):
    error_message = str(error) if error.args else 'Unknown error occurred'
    return make_response(error_message, 500)

# Configure email settings
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_USERNAME'] = 'autoreply978@gmail.com'
app.config['MAIL_PASSWORD'] = SMTP_PASSWORD
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True

mail = Mail(app)

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
            user_info = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            if user_info.isVerified:
                request.authorized_user = user_info
            else:
                request.unauthorized_user = user_info
        except jwt.ExpiredSignatureError:
            return 'Session expired', 401
        except jwt.InvalidTokenError:
            return 'Invalid token', 401

# register blueprints/routes
app.register_blueprint(auth_blueprint)
app.register_blueprint(verify_account_blueprint)
app.register_blueprint(verify_new_email_blueprint)
app.register_blueprint(recover_account_blueprint)
app.register_blueprint(users_blueprint)
