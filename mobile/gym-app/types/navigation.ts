export type RootStackParamList = {
    Workouts: undefined;
    WorkoutDetail: { workoutId: number };
    CurrentWorkout: { workoutId: number };
    ExerciseDetail: { workoutId: number, index: number };
    CreateExercise: { workoutId: number };
    CreateWorkout: undefined;
    CompleteWorkout: { workoutId: number, duration: number };
};