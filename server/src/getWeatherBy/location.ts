import { positionAPI } from '../api/position.js';
import { weatherAPI } from '../api/weather.js';

export const getWeatherByLocation = async (req: any, res: any) => {
    try {
        // Validate query and get [name]
        const { name, ...rest } = req.query;
        if (Object.keys(rest).length) {
            return res.status(400).json({ error: 'Only [name] is allowed' });
        }
        if (!name) {
            return res.status(400).json({ error: '[name] is required' });
        }

        // Get [lat] and [lon] by [name]
        let position;
        try {
            position = await positionAPI(name);
        } catch {
            return res.status(429).json({ error: 'Too many requests to position API' });
        }
        if (!position) {
            return res.status(404).json({ error: 'Location not found' });
        }
        const [lat, lon] = position;

        // Get weather by [lat] and [lon]
        try {
            const result = await weatherAPI(lat, lon);
            return res.status(200).json(result);
        } catch {
            return res.status(429).json({ error: 'Too many requests to weather API' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json();
    }
};
