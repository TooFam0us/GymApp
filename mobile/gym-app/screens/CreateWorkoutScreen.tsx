import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type CreateWorkoutNavigationProp =  NativeStackNavigationProp<RootStackParamList, 'CreateWorkout'>;

export default function CreateWorkoutScreen() {

    const navigation = useNavigation<CreateWorkoutNavigationProp>();

    const [name, setName] = useState('');
    const [existingWorkouts, setExistingWorkouts] = useState<any[]>([]);


    const fetchExistingWorkouts = async () => {
        try {
            const response = await api.get('/workouts/');
            setExistingWorkouts(response.data);
        } catch (error) {
            console.error('Error fetching existing workouts:', error);
            Alert.alert('Error', 'Could not fetch existing workouts.');
        }
    };

    useEffect(() => {
        fetchExistingWorkouts();
    }, []);

    // Creating new empty workout
    const createWorkout = async () => {
        if(!name){
            Alert.alert('Validation Error', 'Workout name is required.');
            return;
        }

        try {
            const response = await api.post('/workouts/', { title: name, date: new Date().toISOString(), duration: 0, exercises: [] });
            Alert.alert('Success', 'Workout created successfully!');
            navigation.navigate('WorkoutDetail', { workoutId: response.data.id });
        }
        catch (error) {
            console.error('Error creating workout:', error);
            Alert.alert('Error', 'Could not create workout.');
        }
    };

    // Cloning existing workout
    const cloneWorkout = async (workout: any) => {
        try {
            const clonedWorkout = {
                title: workout.title + ' (Clone)',
                date: new Date().toISOString(),
                duration: 0, // Reset duration for the new workout
                exercises: workout.exercises.map((exercise: any) => ({
                    name: exercise.name,
                    sets: exercise.sets.map((set: any) => ({
                        reps: set.reps,
                        weight: set.weight,
                        completed: false
                    }))
                }))
            };
            
            console.log('Cloned: ' + clonedWorkout);

            const response = await api.post('/workouts/', clonedWorkout);
            Alert.alert('Success', 'Workout cloned successfully!');
            navigation.navigate('WorkoutDetail', { workoutId: response.data.id});
        }
        catch (error) {
            console.error('Error cloning workout:', error);
            Alert.alert('Error', 'Could not clone workout.');
        }
    };


    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create New Workout</Text>

            <TextInput
                placeholder="Workout Name"
                value={name}
                onChangeText={setName}
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
            />

            <Button title="Create Workout" onPress={createWorkout} />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>Add From Library</Text>
            <FlatList
                data={existingWorkouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => cloneWorkout(item)}
                        style={{ padding: 15, borderBottomWidth: 1, marginBottom: 8, borderRadius: 6, borderColor: '#ccc' }}
                    >
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text style={{ color: '#666' }}>{new Date(item.date).toLocaleDateString()}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}