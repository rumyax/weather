export const weatherAPI = async (lat: number, lon: number) => {
    const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`);
    const result = await response.json();
    const weather = result.properties.timeseries.filter((item: any) => {
        const date = new Date(item.time);
        return date.getUTCHours() == 12;
    }).map((item: any) => ({
        time: item.time,
        temperature: item.data.instant.details.air_temperature
    }));

    return {
        position: { lat, lon },
        weather
    };
};
