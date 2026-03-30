import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../api';

type WorkoutDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutDetail'>;


export default function WorkoutDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation<WorkoutDetailNavigationProp>();
    const { workoutId } = route.params as { workoutId: number };

    const [workout, setWorkout] = useState<any>(null);

    const fetchWorkout = async () => {
        try {
            const response = await api.get(`/workouts/${workoutId}`);
            setWorkout(response.data);
        } catch (error) {
            console.error('Error fetching workout details:', error);
        }
    };


    useEffect(() => {
        fetchWorkout();
    }, []);

    if (!workout) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{workout.title}</Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Date: {new Date(workout.date).toLocaleDateString()}</Text>
            <Text style={{ fontSize: 18 }}>Duration: {workout.duration} mins</Text>

            <Text style={{ marginTop: 20 }}>Exercises: </Text>
            {workout.exercises.map((exercise: any) => (
                <View key={exercise.id} style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{exercise.name}</Text>
                    {exercise.sets.map((set: any) => (
                        <Text key={set.id}>
                            {set.reps} reps @ {set.weight} kg
                        </Text>
                    ))}
                </View>
            ))}
            <View style={{ height: 20 }}>
                <Button title="Start Workout" onPress={() => {navigation.navigate("CurrentWorkout", {workoutId: workout.id})}} />
            </View>
        </View>
    );
}