import React, {useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, Button, TextInput, Alert } from "react-native";
// @ts-ignore
import Slider from "@react-native-community/slider";
import api from "../api";



export default function CompleteWorkoutScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { workoutId, duration } = route.params as { workoutId: number, duration: number };

    const [notes, setNotes] = useState("");
    const [intensity, setIntensity] = useState(5);
    const [totalWeight, setTotalWeight] = useState(0);
    const [editableDuration, setEditableDuration] = useState(duration);

    useEffect(() => {
        // Fetch workout data
        const fetchWorkout = async () => {
            try {
                const response = await api.get(`/workouts/${workoutId}`);
                const workout = response.data;

                let totalWeight = 0;
                workout.exercises.foreach((exercise: any) => {
                    exercise.sets.foreach((set: any) => {
                        if(set.completed){
                            totalWeight += (set.weight || 0) * (set.reps || 0);
                        }
                    });
                });

                setTotalWeight(totalWeight);
            } catch (error) {
                console.error('Error fetching workout details:', error);
                Alert.alert('Error', 'Could not fetch workout details.');
            }
        };
        fetchWorkout();
    }, [workoutId]);

    const confirmCompletion = async () => {
        try {
            await api.put(`/workouts/${workoutId}/complete`, {
                duration: editableDuration,
                notes: notes,
                intensity: intensity,
            });
            Alert.alert('Success', 'Workout completed successfully!');
            navigation.reset({
                index: 0,
                routes: [{ name: "Workouts" as never}],
            });
        } catch (error) {
            console.error('Error completing workout:', error);
            Alert.alert('Error', 'Could not complete workout.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold"}}>Workout Summary</Text>

            <Text style={{ marginTop: 20}}>Duration:</Text>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 5, marginBottom: 10 }}
                keyboardType="numeric"
                value={editableDuration.toString()}
                onChangeText={(text) => setEditableDuration(Number(text))}
            />

            <Text>Total Weight Lifted: {totalWeight} kg</Text> 

            <Text style={{ marginTop: 20}}>Notes:</Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes about your workout..."
                multiline
                style={{ borderWidth: 1, padding: 10, height: 100, marginBottom: 10 }}
            />

            <Text>Intensity: {intensity}</Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={intensity}
                onValueChange={setIntensity}
                minimumTrackTintColor="#1EB1FC"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1EB1FC"
            />

            <Button title="End workout" onPress={confirmCompletion} />
            
        </View>
    );
}   