from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
import models, schemas


router = APIRouter(prefix="/workouts/{workout_id}/exercises", tags=["Exercises"])


# ----------------------------
# Exercise Endpoints
# ----------------------------

@router.post("/", response_model=schemas.Exercise)
def add_exercise(workout_id: int, exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    try:
        db_exercise = models.Exercise(
            name=exercise.name, 
            workout=db_workout, 
            sets=[models.Set(reps=set_.reps, weight=set_.weight) for set_ in exercise.sets]
        )

        db.add(db_exercise)
        db.commit()
        db.refresh(db_exercise)
        return db_exercise
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add exercise")
    
    
@router.put("/{exercise_id}", response_model=schemas.Exercise)
def update_exercise(workout_id: int, exercise_id: int, exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    db_exercise = db.query(models.Exercise).filter_by(id=exercise_id, workout_id=workout_id).first()
    if db_exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    try:
        db_exercise.name = exercise.name
        db_exercise.sets.clear()

        # Add updated sets
        db_exercise.sets = [models.Set(reps=set_.reps, weight=set_.weight) for set_ in exercise.sets]

        db.commit()
        db.refresh(db_exercise)
        return db_exercise
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update exercise")
    

@router.get("/", response_model=list[schemas.Exercise])
def read_exercises(workout_id: int, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    if not db_workout.exercises:
        raise HTTPException(status_code=404, detail="No exercises found for this workout")
    return db_workout.exercises


@router.get("/{exercise_id}", response_model=schemas.Exercise)
def read_exercise(workout_id: int, exercise_id: int, db: Session = Depends(get_db)):
    db_exercise = db.query(models.Exercise).filter_by(id=exercise_id, workout_id=workout_id).first()
    if db_exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return db_exercise



@router.delete("/{exercise_id}", response_model=schemas.Exercise)
def delete_exercise(workout_id: int, exercise_id: int, db: Session = Depends(get_db)):
    db_exercise = db.query(models.Exercise).filter_by(id=exercise_id, workout_id=workout_id).first()
    if db_exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    db.delete(db_exercise)
    db.commit()
    return db_exercise