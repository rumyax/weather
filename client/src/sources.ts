export const dateString = (date: string) => new Date(date).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).split(',').join(' /');

export const setCoordinate = (value: string, setter: Function, [min, max]: [number, number]) => {
    // Optional minus sign followed by optional digits with optional decimal point
    if (value.match(/^(-?(?:\d*|\d*\.\d*))$/)) {
        const num = parseFloat(value);

        if (!isNaN(num)) {
            if (num < min) {
                setter(min.toString());
                return;
            }

            if (num > max) {
                setter(max.toString());
                return;
            }
        }

        setter(value);
    }
};

export const style = {
    margin: { margin: '20px' },
    button: (disabled: boolean) => ({
        margin: '20px',
        backgroundColor: 'darkslategray',
        color: disabled ? 'orangered' : 'limegreen'
    })
};

export const explanation = [
    'Here you can get weather forecast by location name or coordinates (latitude and longitude).',
    'PLEASE NOTE: the temperature values are provided for 14:00 local time of the specified location.'
];
