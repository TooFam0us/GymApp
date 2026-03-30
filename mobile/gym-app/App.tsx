import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import WorkoutsScreen from './screens/WorkoutsScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';
import CreateWorkoutScreen from './screens/CreateWorkoutScreen';
import CurrentWorkoutScreen from './screens/CurrentWorkoutScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import CreateExerciseScreen from './screens/CreateExerciseScreen';
import CompleteWorkoutScreen from './screens/CompleteWorkoutScreen';



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Workouts">
        <Stack.Screen name="Workouts" component={WorkoutsScreen} options={{ title: 'WorkoutsScreen' }} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: 'WorkoutDetailsScreen' }} />
        <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} options={{ title: 'CreateWorkoutScreen' }} />
        <Stack.Screen name="CurrentWorkout" component={CurrentWorkoutScreen} options={{ title: 'CurrentWorkoutScreen' }} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'ExerciseDetailScreen' }} />
        <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} options={{ title: 'CreateExerciseScreen' }} />
        <Stack.Screen name="CompleteWorkout" component={CompleteWorkoutScreen} options={{ title: 'CompleteWorkoutScreen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}