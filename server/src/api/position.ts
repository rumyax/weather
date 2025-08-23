export const positionAPI = async (name: string): Promise<[number, number] | undefined> => {
    const encodedName = encodeURIComponent(name);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodedName}&format=json&limit=1`);
    const result = await response.json();
    return result.map((location: any) => [location.lat, location.lon].map(parseFloat))[0];
};
