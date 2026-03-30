import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import api from "../api";

type CreateExerciseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateExercise'>;

export default function CreateExerciseScreen() {
    const navigation = useNavigation<CreateExerciseNavigationProp>();
    const route = useRoute();
    const { workoutId } = route.params as { workoutId: number };

    const [name, setName] = useState("");

    const createExercise = async () => {
        if (!name.trim()) {
            Alert.alert("Validation Error", "Exercise name is required.");
            return;
        }

        try {
            const response = await api.post(`/workouts/${workoutId}/exercises/`, { name, sets: [] /*Empty initially*/ });
            Alert.alert("Success", "Exercise created successfully!");
            navigation.navigate("CurrentWorkout", { workoutId });
        } catch (error) {
            console.error("Error creating exercise:", error);
            Alert.alert("Error", "Could not create exercise.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Exercise Name:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g Bench Press"
            />
            <Button title="Add Exercise" onPress={createExercise} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    label: { fontSize: 18, marginBottom: 8 },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 8, 
        marginBottom: 16, 
        borderRadius: 7 
    },
});