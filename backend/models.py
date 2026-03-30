from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Workout(Base):
    __tablename__ = 'workouts'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)  # in minutes
    notes = Column(String, nullable=True)
    intensity = Column(Integer, nullable=True)  # e.g., scale of 1-10

    #OTM relationship with Exercise
    exercises = relationship("Exercise", back_populates="workout", cascade="all, delete-orphan")

class Set(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True)
    reps = Column(Integer, nullable=False)
    weight = Column(Integer, nullable=False)  # in kg
    completed = Column(Boolean, default=False)

    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    exercise = relationship("Exercise", back_populates="sets")

class Exercise(Base):
    __tablename__ = 'exercises'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    workout_id = Column(Integer, ForeignKey('workouts.id'))
    workout = relationship("Workout", back_populates="exercises")
    
    sets = relationship("Set", back_populates="exercise", cascade="all, delete-orphan")