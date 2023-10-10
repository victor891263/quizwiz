# QuizWiz - API

This guide will walk you through the process of setting up and running the QuizWiz's API on your local machine, as well as configuring a MongoDB database locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Python](https://www.python.org/downloads/) (3.6 or higher)
- [MongoDB](https://docs.mongodb.com/manual/installation/) (Community Edition)
- [Pipenv](https://pipenv.pypa.io/en/latest/install/#installing-pipenv) (for managing Python dependencies)
- [Cloudinary account](https://cloudinary.com/)
- SMTP of your choice

## Setting up the database locally

### 1. Start MongoDB Service

On Linux, you can use the following command:

```bash
sudo systemctl start mongod
```

On macOS, you can start MongoDB with:

```bash
brew services start mongodb-community@4.4
```

On Windows, open the Command Prompt as an administrator and run:

```bash
net start MongoDB
```

### 2.Connect to MongoDB

You can use the MongoDB command-line shell to interact with the database. Open a new terminal and run:

```
mongo
```

### 3. Create a database

In the MongoDB shell, create a new database for QuizWiz (replace <database_name> with your desired name):

```
use <database_name>
```

Don't forget to retrieve the connection string so that it can be used to connect to the database in the next step (replace <database_name> with your desired name).

```
mongodb://localhost/<database_name>
```

## Running on your local machine

### 1. Clone the Repository

Clone the QuizWiz repository to your local machine:

```
git clone https://github.com/victor891263/quizwiz .
cd server
```

### 2. Install dependencies:

Use Pipenv to create a virtual environment and install the Python dependencies:

```bash
pipenv install
```

### 3. Configure environment variables:

Create a .env file in the API directory and set the following environment variables:

- **CLIENT_URL:** url of your hosted front-end

- **CLOUDINARY_API_KEY:** api key of your cloudinary cloud

- **CLOUDINARY_API_SECRET:** api secret of your cloudinary cloud

- **CLOUDINARY_CLOUD_NAME:** name of your cloudinary cloud

- **DATABASE_URI:** connection string for your local MongoDB database

- **JWT_SECRET:** string used to generate json web tokens

- **SMTP_PASSWORD:** password for the smtp of your choice. Refer to your email provider for this

### 4. Initialize the API

```bash
pipenv run gunicorn -b 0.0.0.0:8000 app:app
```

The API will be accessible at `http://localhost:8000`.





