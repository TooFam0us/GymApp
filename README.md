# Workout App Backend (WIP)

This is a backend service for a workout tracking mobile application.
Built with **FastAPI** and **PostgreSQL**, it provides basic functionality for creating and retrieving workouts.

## Features

* Create workouts with:

  * Title
  * Description
  * Date
  * Exercises (sets & reps)
* Retrieve stored workouts
* REST API with automatic documentation

## Tech Stack

* FastAPI (Python)
* SQLAlchemy
* PostgreSQL

## Running the Project

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Set up your database and update the connection string.

3. Run the server:

   ```bash
   uvicorn main:app --reload
   ```

4. Open API docs:

   ```
   http://127.0.0.1:8000/docs
   ```

## ⚠️ Important

This project is a **Work In Progress (WIP)**.
Expect incomplete features, breaking changes, and ongoing development.
