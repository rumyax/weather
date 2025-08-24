import axios from 'axios';

const weatherAPI = axios.create({ baseURL: '/api/getWeatherBy/' });

export const API = {
    getWeatherBy: {
        location: async (name: string) => await weatherAPI.get('location', { params: { name } }),
        position: async (position?: { lat: number; lon: number }) => await weatherAPI.get('position', { params: position })
    }
};
