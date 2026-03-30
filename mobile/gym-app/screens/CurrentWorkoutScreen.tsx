import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../api';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type CurrentWorkoutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CurrentWorkout'>;

export default function CurrentWorkoutScreen() {
    const route = useRoute();
    const navigation = useNavigation<CurrentWorkoutNavigationProp>();
    const { workoutId } = route.params as { workoutId: number };

    const [workout, setWorkout] = useState<any>(null);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (s: number) => {
        const minutes = Math.floor(s / 60);
        const seconds = s % 60;
        return `${minutes}:${seconds < 10 ? "0": ""}${seconds}`;
    };

    const fetchWorkout = async () => {
        try {
            const response = await api.get(`/workouts/${workoutId}`);
            setWorkout(response.data);
        } catch (error) {
            console.error('Error fetching workout details:', error);
            Alert.alert('Error', 'Could not fetch workout details.');
        }
    };

    useEffect(() => {
        fetchWorkout();
    }, []);



    if(!workout) return <Text>Loading...</Text>

    const removeExercise = async (exerciseId: number) => {
        try {
            await api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
            setWorkout({...workout, exercises: workout.exercises.filter((ex: any) => ex.id !== exerciseId)});
            Alert.alert('Success', 'Exercise removed successfully.');
        } catch (error) {
            console.error('Error removing exercise:', error);
            Alert.alert('Error', 'Could not remove exercise.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{workout.title}</Text>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Time: {formatTime(seconds)}</Text>

            <Button title="Add Exercise" onPress={() => navigation.navigate("CreateExercise", {workoutId})} />
            <FlatList
                data={workout.exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{ 
                            padding: 15, 
                            borderWidth: 1, 
                            borderColor: '#ccc', 
                            borderRadius: 6,
                            marginBottom: 10
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                        <Button title="Remove Exercise" onPress={() => removeExercise(item.id)} />
                        <Button title="Manage Exercise" onPress={() => 
                            navigation.navigate("ExerciseDetail", {
                                workoutId: workout.id, 
                                index: workout.exercises.findIndex((ex: any) => ex.id === item.id),
                                })
                            } 
                        />       
                    </View>       
                )}  
            />


            <Button 
                title="Start Workout" 
                onPress={() => {
                    setIsActive(true);
                    if (workout.exercises.length > 0) {
                        navigation.navigate("ExerciseDetail", {
                            workoutId: workout.id, 
                            index: 0,
                        });
                    } else {
                        Alert.alert("No Exercises", "Please add exercises to the workout first.");
                    }
                }}
            />
        </View>
    );
}