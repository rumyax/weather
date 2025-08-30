import tzlookup from 'tz-lookup';
import { DateTime } from 'luxon';

const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

// GMT offset depends on location and time of the year (daylight saving time)
export const getGmtOffset = (lat: number, lon: number, time: number): number => {
    // Time in ms since epoch
    const tz = tzlookup(lat, lon);
    const dtUtc = DateTime.fromMillis(time, { zone: 'UTC' });
    const dtLocal = dtUtc.setZone(tz);
    const offsetMinutes = dtLocal.offset;
    return offsetMinutes * MINUTE;
};

export const interpolate = (x: number, x0: number, x1: number, y0: number, y1: number): number => {
    if (x1 == x0) return (y0 + y1) / 2; // Prevent division by zero
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
};

export const positiveMod = (a: number, b: number): number => ((a % b) + b) % b;

export const roundToHundredths = (a: number): number => Math.round(a * 100) / 100;

export const utcMidnight = (time: number): number => {
    const date = new Date(time);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime();
};
