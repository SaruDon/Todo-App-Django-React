# To-Do App

This is a full-stack To-Do application built using Django and React.js. It allows users to create, manage, and delete their to-do tasks. The app uses a PostgreSQL database hosted on AWS RDS and is deployed on Vercel.

## Features

- User authentication (sign-up, log-in, log-out)
- Create, edit, and delete to-do tasks
- Mark tasks as completed
- Responsive design for desktop and mobile use

## Tech Stack

- **Backend:** Django (Python)
- **Frontend:** React.js
- **Database:** PostgreSQL hosted on AWS RDS
- **Hosting:** Vercel for frontend and Render for backend

## Live Demo

Check out the live version of the app here: [To-Do App](https://todo-app-django-react-3o9g.vercel.app/)

## Installation

### Prerequisites

- Python 3.x
- Node.js and npm
- PostgreSQL

### Backend Setup (Django)

### Step 1: Install Dependencies
Open your terminal and navigate to the Backend directory, then install the required packages:


cd Backend
pip install -r requirements.txt

### Step 2: Set Up PostgreSQL Database(I have used AWS RSD)
Create a New PostgreSQL Database on AWS RDS:

Go to the AWS Management Console and navigate to the RDS service.
Create a new database instance, selecting PostgreSQL as the engine.
Make note of your database name, username, password, and the RDS endpoint provided by AWS.
Update settings.py: Open your Django project's settings.py file and update the DATABASES setting to connect to your RDS instance:

python
settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your-db-name',        # Replace with your database name
        'USER': 'your-db-user',        # Replace with your database username
        'PASSWORD': 'your-db-password', # Replace with your database password
        'HOST': 'your-rds-endpoint',   # Replace with your RDS endpoint
        'PORT': '5432',                 # Default PostgreSQL port
    }
}
also add 
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
SECRET_KEY =

### Step 3: Run Migrations
After setting up the database, apply migrations to create the necessary database tables:


python manage.py migrate
### Step 4: Start the Django Development Server
Finally, start your Django development server to ensure everything is working correctly:

python manage.py runserver
Notes
Ensure your local machine can connect to your AWS RDS instance (consider setting up security groups in AWS).
If you encounter any issues with the database connection, check that your credentials and endpoint are correct, and that the RDS instance is publicly accessible or accessible from your network.
This should set up your Django application with PostgreSQL on AWS RDS successfully!

## FrontEnd 

## Step1 cd/todo

## Step1 npm i

## Step 3 replace axios with your backend deployed link

## Step 4 npm run dev

