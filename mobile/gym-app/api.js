import axios from 'axios';

const api = axios.create({
    baseURL: "http://10.0.2.2:8000", // <-- Adjusted for Android emulator
    timeout: 5000,
});

export default api;