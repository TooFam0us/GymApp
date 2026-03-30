import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    Alert,
    StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type ExerciseDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetailScreen(){
    const route = useRoute();
    const navigation = useNavigation<ExerciseDetailNavigationProp>();
    const { workoutId, index } = route.params as { workoutId: number, index: number };

    const [workout, setWorkout] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(index);
    const exercise = workout?.exercises[currentIndex];

    // Fetch exercise details
    const fetchExercises = async () => {
        try {
            const response = await api.get(`/workouts/${workoutId}/exercises/`);
            setWorkout({exercises: response.data});
        } catch (error) {
            console.error('Error fetching exercise details:', error);
            Alert.alert('Error', 'Could not fetch exercise details.');
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);


    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goNext = () => {
        if (currentIndex < workout.exercises.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Last exercise -> complete the workout
            navigation.navigate("CompleteWorkout", { workoutId, duration: workout.duration }); 
        }
    }

    // Add new set
    const addEmptySet = async () => {
        try {
            const response = await api.post(`/workouts/${workoutId}/exercises/${exercise.id}/sets/`, {
                reps: 0,
                weight: 0,
            });
            const updatedExercises = [...workout.exercises];
            updatedExercises[currentIndex].sets.push(response.data);
            setWorkout({exercises: updatedExercises});
        } catch (error) {
            console.error('Error adding set:', error);
            Alert.alert('Error', 'Could not add set.');
        }
    }

    // Remove set
    const removeLastSet = async () => {
        if (!exercise?.sets?.length) {
            Alert.alert('Error', 'No sets to remove.');
            return;
        }

        const lastSet = exercise.sets[exercise.sets.length - 1];

        try {
            await api.delete(`/workouts/${workoutId}/exercises/${exercise.id}/sets/${lastSet.id}`);
            const updatedExercises = [...workout.exercises];
            updatedExercises[currentIndex].sets.pop();
            setWorkout({exercises: updatedExercises});
        } catch (error) {
            console.error('Error removing set:', error);
            Alert.alert('Error', 'Could not remove set.');
        }
    };

    if (!exercise) return <Text>Loading...</Text>;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{exercise.name}</Text>

            <FlatList
                data={exercise.sets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SetRow 
                        item={item}
                        workoutId={workoutId}
                        exerciseId={exercise.id}
                        onUpdate={(updatedSet) => {
                            const updatedExercises = [...workout.exercises];
                            updatedExercises[currentIndex].sets = updatedExercises[currentIndex].sets.map(
                                (set: any) => (set.id === updatedSet.id ? updatedSet : set)
                            );
                            setWorkout({exercises: updatedExercises});
                        }}
                    />
                )}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <Button title="Add New Set" onPress={addEmptySet} />
                <Button title="Remove Last Set" onPress={removeLastSet} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                <Button title="Previous Exercise" onPress={goPrev} disabled={currentIndex === 0} />
                <Button title={currentIndex === workout.exercises.length - 1 ? "Complete Workout" : "Next Exercise"} onPress={goNext} />
            </View>
        </View>
    );
}

function SetRow({
    item,
    workoutId,
    exerciseId,
    onUpdate,
}: {
    item: any;
    workoutId: number;
    exerciseId: number;
    onUpdate: (updatedSet: any) => void;
}) {
    const [localReps, setLocalReps] = useState(String(item.reps ?? ''));
    const [localWeight, setLocalWeight] = useState(String(item.weight ?? ''));
    const [completed, setCompleted] = useState(false);

    const saveSet = async () => {
        try {
            const response = await api.put(`/workouts/${workoutId}/exercises/${exerciseId}/sets/${item.id}`,   
                {
                    reps: parseInt(localReps),
                    weight: parseFloat(localWeight),
                }
            );
            onUpdate(response.data);
        } catch (error) {
            console.error('Error updating set:', error);
            Alert.alert('Error', 'Could not update set.');
        }
    };

    const toggleComplete = async () => {
        setCompleted(!completed);
        try {
            const response = await api.put(
                `/workouts/${workoutId}/exercises/${exerciseId}/sets/${item.id}`, 
                {
                    reps: parseInt(localReps),
                    weight: parseFloat(localWeight),
                    completed: !completed,
                }
            );
            onUpdate(response.data);
        } catch (error) {
            console.error('Error updating set:', error);
            Alert.alert('Error', 'Could not update set.');
        }
    }

    return (
        <View style={styles.setRow}>
            <TextInput
                style={[styles.input, completed && styles.inputDisabled]}
                keyboardType="numeric"
                value={localReps}
                onChangeText={setLocalReps}
                onBlur={saveSet}
                placeholder='Reps'
                editable={!completed}
            />
            <TextInput
                style={[styles.input, completed && styles.inputDisabled]}
                keyboardType="numeric"
                value={localWeight}
                onChangeText={setLocalWeight}
                onBlur={saveSet}
                placeholder='Weight'
                editable={!completed}
            />
            <Button 
                title={completed ? "Unlock" : "Complete"}
                color={completed ? "orange" : "green"}
                onPress={toggleComplete} />
        </View>
    );
}

const styles = StyleSheet.create({
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        width: 60,
        textAlign: 'center',
    },
    inputDisabled: {
        backgroundColor: '#eee',
        color: '#888',
    }
});
