import { useEffect, useState } from 'react';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Replay } from '@mui/icons-material';
import './App.css';
import { API } from './api';
import { dateString, explanation, setCoordinate, style } from './sources';

const App = () => {
    const [location, setLocation] = useState('Belgrade');
    const [lat, setLat] = useState('44.8178131');
    const [lon, setLon] = useState('20.4568974');
    const [locationDisabled, setLocationDisabled] = useState(false);
    const [positionDisabled, setPositionDisabled] = useState(false);
    const [forecast, setForecast] = useState({
        position: { lat: 0, lon: 0 },
        weather: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await API.getWeatherBy.position();
            setForecast(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setLocationDisabled(!location.trim().length);
    }, [location]);

    useEffect(() => {
        setPositionDisabled(isNaN(parseFloat(lat)) || isNaN(parseFloat(lon)));
    }, [lat, lon]);

    const getWeatherBy = {
        location: async () => {
            try {
                const { data } = await API.getWeatherBy.location(location);
                setForecast(data);
                setLat(data.position.lat.toString());
                setLon(data.position.lon.toString());
            } catch {
                alert('Error getting weather by location');
            }
        },

        position: async () => {
            try {
                const { data } = await API.getWeatherBy.position({
                    lat: parseFloat(lat),
                    lon: parseFloat(lon)
                });
                setForecast(data);
                setLocation('');
            } catch {
                alert('Error getting weather by position');
            }
        }
    };

    return <>
        <div className="inputsOuter">
            <div className="inputsInner">
                <TextField
                    label="Location Name"
                    helperText="The name of the city or settlement"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={style.margin}
                /><IconButton
                    onClick={getWeatherBy.location}
                    disabled={locationDisabled}
                    style={style.button(locationDisabled)}
                ><Replay/></IconButton>
            </div>
            <div className="inputsInner">
                <TextField
                    label="Latitude"
                    helperText="South - North (between -90 and 90)"
                    value={lat}
                    onChange={e => setCoordinate(e.target.value, setLat, [-90, 90])}
                    style={style.margin}
                /><TextField
                    label="Longitude"
                    helperText="West - East (between -180 and 180)"
                    value={lon}
                    onChange={e => setCoordinate(e.target.value, setLon, [-180, 180])}
                    style={style.margin}
                /><IconButton
                    onClick={getWeatherBy.position}
                    disabled={positionDisabled}
                    style={style.button(positionDisabled)}
                ><Replay/></IconButton>
            </div>
        </div>
        <div style={style.margin}>
            {explanation.map((text, i) => <Typography key={i}>{text}</Typography>)}
        </div>
        <TableContainer component={Paper} sx={{ width: '80%', margin: 'auto', marginTop: '40px' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Temperature, °C</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {forecast.weather?.map((day: any) => <TableRow key={day.time}>
                        <TableCell>{dateString(day.time)}</TableCell>
                        <TableCell align="right">{day.temperature}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    </>;
};

export default App;
