import os
from flask import Flask, make_response
from flask_cors import CORS
import mongoengine
from dotenv import load_dotenv

# load stuff from env file
load_dotenv()
DATABASE_URI = os.environ['DATABASE_URI']

# initialize API
app = Flask(__name__)
CORS(app)

# catch all errors
@app.errorhandler(Exception)
def catch_error(error):
    return make_response(error.args[0], 500)

# connect to database
try:
    mongoengine.connect(host=DATABASE_URI)
    print('Connected to database!')
except Exception as connect_error:
    print(f'Failed to connect to database!\n{connect_error}')

# disconnect from database if API stops running
@app.teardown_appcontext
def disconnect_db(error):
    print(error)
    try:
        mongoengine.disconnect()
        print('Disconnected from database!')
    except Exception as disconnect_error:
        print(f'Failed to disconnect from database!\n{disconnect_error}')


