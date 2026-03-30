from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class SetBase(BaseModel):
    reps: int = Field(..., ge=0)
    weight: float = Field(..., ge=0)  # in kg
    completed: bool = False

class SetCreate(SetBase):
    pass

class Set(SetBase):
    id: int

    class Config:
        orm_mode = True

class ExerciseBase(BaseModel):
    name: str = Field(..., min_length=1)

class ExerciseCreate(ExerciseBase):
    sets: list[SetCreate] = []

class Exercise(ExerciseBase):
    id: int
    sets: list[Set]

    class Config:
        orm_mode = True

class WorkoutBase(BaseModel):
    title: str = Field(..., min_length=1)
    date: datetime
    duration: int = Field(0, ge=0)  # in minutes

class WorkoutCreate(WorkoutBase):
    exercises: List[ExerciseCreate] = []

class Workout(WorkoutBase):
    id: int
    exercises: List[Exercise]

    class Config:
        orm_mode = True

class CompleteWorkoutBase(BaseModel):
    duration: int  # in minutes
    notes: str | None = None
    intensity: int

class CompleteWorkoutRequest(CompleteWorkoutBase):
    pass

class CompleteWorkoutResponse(CompleteWorkoutBase):
    total_weight: float  # in kg

    class Config:
        orm_mode = True