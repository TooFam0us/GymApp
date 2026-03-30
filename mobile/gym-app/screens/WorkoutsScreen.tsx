import React, { use, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

type Workout = {
  id: number;
  name: string;
  date: string;
  duration: number; // in minutes
};

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Workouts'>>();

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts/');
            setWorkouts(response.data);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Workouts</Text>
            <FlatList
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
                        style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}
                    >
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text style={{ color: '#666' }}>{new Date(item.date).toLocaleDateString()} - {item.duration} mins</Text>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('CreateWorkout')}
                style={{ marginTop: 20, padding: 15, backgroundColor: '#007bff', borderRadius: 5 }}
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Create new workout</Text>
            </TouchableOpacity>
        </View>
    );
}