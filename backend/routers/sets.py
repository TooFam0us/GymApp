from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database import get_db
import models, schemas

router = APIRouter(prefix="/workouts/{workout_id}/exercises/{exercise_id}/sets", tags=["Sets"])



# ----------------------------
# Set Endpoints
# ----------------------------

@router.post("/", response_model=schemas.Set)
def add_set(workout_id: int, exercise_id: int, set_data: schemas.SetCreate, db: Session = Depends(get_db)):
    db_exercise = db.query(models.Exercise).filter_by(id=exercise_id, workout_id=workout_id).first()
    if db_exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    try:
        db_set = models.Set(reps=set_data.reps, weight=set_data.weight, exercise=db_exercise)
        db.add(db_set)
        db.commit()
        db.refresh(db_set)
        return db_set

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add set")
    
@router.put("/{set_id}", response_model=schemas.Set)
def update_set(workout_id: int, exercise_id: int, set_id: int, updated_set: schemas.SetCreate, db: Session = Depends(get_db)):
    db_set = (db.query(models.Set)
        .join(models.Exercise).filter(
            models.Set.id == set_id, 
            models.Set.exercise_id == exercise_id, 
            models.Exercise.workout_id == workout_id
        )
        .first()
    )
    if db_set is None or db_set.exercise_id != exercise_id or db_set.exercise.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found")
    
    try:
        db_set.reps = updated_set.reps
        db_set.weight = updated_set.weight
        db_set.completed = updated_set.completed

        db.commit()
        db.refresh(db_set)
        return db_set
    
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update set")
    

@router.get("/", response_model=list[schemas.Set])
def read_sets(workout_id: int, exercise_id: int, db: Session = Depends(get_db)):
    db_exercise = db.query(models.Exercise).filter_by(id=exercise_id, workout_id=workout_id).first()
    if db_exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return db_exercise.sets


@router.get("/{set_id}", response_model=schemas.Set)
def read_set(workout_id: int, exercise_id: int, set_id: int, db: Session = Depends(get_db)):
    db_set = (db.query(models.Set)
        .join(models.Exercise).filter(
            models.Set.id == set_id, 
            models.Set.exercise_id == exercise_id, 
            models.Exercise.workout_id == workout_id
        )
        .first()
    )
    if db_set is None or db_set.exercise_id != exercise_id or db_set.exercise.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found")
    
    return db_set
    

@router.delete("/{set_id}", response_model=schemas.Set)
def delete_set(workout_id: int, exercise_id: int, set_id: int, db: Session = Depends(get_db)):
    db_set = (db.query(models.Set)
        .join(models.Exercise).filter(
            models.Set.id == set_id, 
            models.Set.exercise_id == exercise_id, 
            models.Exercise.workout_id == workout_id
        )
        .first()
    )
    
    if db_set is None or db_set.exercise_id != exercise_id or db_set.exercise.workout_id != workout_id:
        raise HTTPException(status_code=404, detail="Set not found")
    
    db.delete(db_set)
    db.commit()
    return db_set