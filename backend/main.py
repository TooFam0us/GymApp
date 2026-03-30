from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from database import Base, engine, SessionLocal
from routers import workouts, exercises, sets

Base.metadata.create_all(engine)

app = FastAPI()

app.include_router(workouts.router)
app.include_router(exercises.router)
app.include_router(sets.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust as needed for production for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(engine.url)

inspector = inspect(engine)
print(inspector.get_table_names())

