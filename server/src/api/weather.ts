import { DAY, HOUR, getGmtOffset, interpolate, positiveMod } from '../sources.js';

const DEFAULT_TARGET = 14 * HOUR; // Local time in ms (since local midnight)

export const weatherAPI = async (lat: number, lon: number, timeSinceLocalMidnight: number = DEFAULT_TARGET) => {
    const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
    const result = await response.json();
    const forecast = result.properties.timeseries.map((item: any) => ({
        time: new Date(item.time).getTime(),
        temperature: item.data.instant.details.air_temperature
    }));

    const weather: { time: string; temperature: number }[] = [];
    const addWeatherPoint = (time: number, temperature: number) => weather.push(
        { time: new Date(time).toISOString(), temperature }
    );

    for (let i = 0; i < forecast.length; i++) {
        const curr = forecast[i];

        // Calculate time in ms since UTC midnight for the current date and location
        const offset = getGmtOffset(lat, lon, curr.time);
        const timeSinceUtcMidnight = positiveMod(timeSinceLocalMidnight - offset, DAY);

        // Calculate target time
        const dayDate = new Date(curr.time);
        dayDate.setUTCHours(0, 0, 0, 0); // Midnight in UTC
        const targetTime = dayDate.getTime() + timeSinceUtcMidnight;

        // If current time is the target time, add it to the result
        if (targetTime == curr.time) { // Check for exact match for each data point
            addWeatherPoint(targetTime, curr.temperature);
            continue;
        }

        // Otherwise, interpolate between the previous and current time
        if (i == 0) continue; // No previous data point to interpolate with
        const prev = forecast[i - 1];

        if (prev.time < targetTime && targetTime < curr.time) {
            const temperature = interpolate(targetTime, prev.time, curr.time, prev.temperature, curr.temperature);
            addWeatherPoint(targetTime, temperature);
        }
    }

    return { position: { lat, lon }, weather };
};
