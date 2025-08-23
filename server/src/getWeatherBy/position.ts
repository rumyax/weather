import { weatherAPI } from '../api/weather.js';

export const getWeatherByPosition = async (req: any, res: any) => {
    try {
        // Validate query and get [lat] and [lon]
        const { lat: latRaw, lon: lonRaw, ...rest } = req.query;
        if (Object.keys(rest).length) {
            return res.status(400).json({ error: 'Only [lat] and [lon] are allowed' });
        }
        if (latRaw && !lonRaw || !latRaw && lonRaw) {
            return res.status(400).json({ error: 'Both [lat] and [lon] are required' });
        }
        let lat: number;
        let lon: number;
        if (latRaw) {
            lat = parseFloat(latRaw);
            lon = parseFloat(lonRaw);
            if (isNaN(lat) || isNaN(lon)) {
                return res.status(400).json({ error: '[lat] and [lon] must be numbers' });
            }
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return res.status(400).json({ error: '[lat] must be between -90 and 90, [lon] must be between -180 and 180' });
            }
        } else { // Belgrade
            lat = 44.8178131; // North
            lon = 20.4568974; // East
        }

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
