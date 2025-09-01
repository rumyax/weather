import { DAY, HOUR, getCandidates, interpolate, positiveMod, roundToHundredths } from '../sources.js';

const DEFAULT_TARGET = 14 * HOUR; // Local time in ms (since local midnight)

export const weatherAPI = async (lat: number, lon: number, timeSinceLocalMidnight: number = DEFAULT_TARGET) => {
    timeSinceLocalMidnight = positiveMod(timeSinceLocalMidnight, DAY);

    const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
    const result = await response.json();
    const forecast = result.properties.timeseries.map((item: any) => ({
        time: new Date(item.time).getTime(),
        temperature: item.data.instant.details.air_temperature
    }));

    const weather: { time: string; temperature: number }[] = [];
    const seen = new Set<number>();
    const addWeatherPoint = (time: number, temperature: number) => {
        if (seen.has(time)) return;
        seen.add(time);
        weather.push({ time: new Date(time).toISOString(), temperature });
    };

    for (let i = 0; i < forecast.length; i++) {
        const curr = forecast[i];

        // Calculate target time for the current date and location
        const candidates = getCandidates(lat, lon, curr.time, timeSinceLocalMidnight);
        let targetTime = candidates.curr;

        // If current time is the target time, add it to the result
        if (targetTime == curr.time) { // Check for exact match for each data point
            addWeatherPoint(targetTime, curr.temperature);
            continue;
        }

        // Otherwise, interpolate between the previous and current time
        if (i == 0) continue; // No previous data point to interpolate with
        const prev = forecast[i - 1];

        // The target time was calculated based on the current time;
        // so the target time is always in the same day with the current time.
        // However, the previous time can be in the previous day.
        // E.g. the current time is 00:00 UTC (the current day);
        // the previous time is 18:00 UTC (the previous day, i.e. 6 hours ago);
        // and the target time is 14:00 local time GMT-7, i.e. 21:00 UTC (the current day).
        // So if the target time is more than the current time,
        // we can reduce the target time by a day without losing anything.
        if (targetTime > curr.time) targetTime = candidates.prev;

        // Now the target time is always less than the current time.
        if (prev.time < targetTime) {
            const temperature = interpolate(targetTime, prev.time, curr.time, prev.temperature, curr.temperature);
            addWeatherPoint(targetTime, roundToHundredths(temperature));
        }
    }

    return { position: { lat, lon }, weather };
};
