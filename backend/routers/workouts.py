from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
import models, schemas

router = APIRouter(prefix="/workouts", tags=["Workouts"])

# ----------------------------
# Workout Endpoints
# ----------------------------

@router.post("/", response_model=schemas.Workout)
def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    try:
        db_workout = models.Workout(title=workout.title, date=workout.date, duration=workout.duration)

        for exercise in workout.exercises:
            db_exercise = models.Exercise(name=exercise.name)
            db_exercise.sets = [models.Set(reps=set_.reps, weight=set_.weight) for set_ in exercise.sets]
            db_workout.exercises.append(db_exercise)
    

        db.add(db_workout)
        db.commit()
        db.refresh(db_workout)
        return db_workout
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create workout")
    

@router.put("/{workout_id}", response_model=schemas.Workout)
def update_workout(workout_id: int, workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    try:
        db_workout.title = workout.title
        db_workout.date = workout.date
        db_workout.duration = workout.duration

        # Clear existing exercises
        db_workout.exercises.clear()

        # Add updated exercises
        for exercise in workout.exercises:
            db_exercise = models.Exercise(name=exercise.name)
            db_exercise.sets = [models.Set(reps=set_.reps, weight=set_.weight) for set_ in exercise.sets]
            db_workout.exercises.append(db_exercise)

        db.commit()
        db.refresh(db_workout)
        return db_workout
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update workout")
    
@router.put("/{workout_id}/complete", response_model=schemas.CompleteWorkoutResponse)
def complete_workout(workout_id: int, req: schemas.CompleteWorkoutRequest, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if not db_workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    db_workout.duration = req.duration
    db_workout.notes = req.notes
    db_workout.intensity = req.intensity

    total_weight = sum(
        set_.weight * set_.reps 
        for exercise in db_workout.exercises 
        for set_ in exercise.sets
        if set_.completed
    )

    db.commit()
    db.refresh(db_workout)
    return schemas.CompleteWorkoutResponse(
        duration=db_workout.duration,
        notes=db_workout.notes,
        intensity=db_workout.intensity,
        total_weight=total_weight
    )

@router.get("/", response_model=list[schemas.Workout])
def read_workouts(db: Session = Depends(get_db)):
    db_workouts = db.query(models.Workout).all()
    return db_workouts


@router.get("/{workout_id}", response_model=schemas.Workout)
def read_workout(workout_id: int, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    return db_workout


@router.delete("/{workout_id}", response_model=schemas.Workout)
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    db_workout = db.query(models.Workout).filter_by(id=workout_id).first()
    if db_workout is None:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(db_workout)
    db.commit()
    return db_workout