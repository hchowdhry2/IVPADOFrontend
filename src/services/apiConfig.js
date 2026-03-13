import axios from "axios";

export const API_BASE_URL = 'https://localhost:7043/api';

export const apiConfig = axios.create({
    baseURL: `${API_BASE_URL}/Spillage`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiConfigDevops = axios.create({
    baseURL: `${API_BASE_URL}/DevOps`,
    headers: {
        'Content-Type': 'application/json',
    }
});