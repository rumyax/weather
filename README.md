# Basic commands

**Build images and run containers:** `docker compose up --build --detach`

**Web-interface is available here:** http://localhost:8888

**API is available here:** http://localhost:4444/api

**Cleanup:** `docker compose down --rmi all`
*(stop containers, remove containers, and remove images)*

**If you wish only to test API without web-interface:**
```bash
# Build image
docker build --tag "weather:server" --file "./server.dockerfile" .

# Run container
docker run --detach --name "weather-server" --publish "4444:4000" weather:server

# Cleanup (stop container, remove container, and remove image)
docker stop "weather-server"
docker rm "weather-server"
docker rmi "weather:server"
```

_____
# API

### Get weather by position (latitude and longitude)

**Method:** `GET`

**Endpoint:** `http://localhost:4444/api/getWeatherBy/position`

**Query parameters:**
- `lat`
    - *Description:* latitude (South - North)
    - *Type:* `number`
    - *Required:* if `lon` is provided
    - *Constraints:* must be in range `[-90, 90]` (inclusive)
- `lon`
    - *Description:* longitude (West - East)
    - *Type:* `number`
    - *Required:* if `lat` is provided
    - *Constraints:* must be in range `[-180, 180]` (inclusive)

**Default:** if both `lat` and `lon` are not provided, defaults to `lat=44.8125&lon=20.4612` (Belgrade). If one is provided, the second is required.

**Example (for Boston):**
http://localhost:4444/api/getWeatherBy/position?lat=42.3554334&lon=-71.060511

### Get weather by location (city name, etc.)

**Method:** `GET`

**Endpoint:** `http://localhost:4444/api/getWeatherBy/location`

**Query parameters:**
- `name`
    - *Description:* the name of the city or settlement
    - *Type:* `string`
    - *Required:* `true`

**Example (for Boston):**
http://localhost:4444/api/getWeatherBy/location?name=boston

### Returns (the same response structure for both endpoints for consistency):

```json
{
    "position": {
        "lat": <number>,
        "lon": <number>
    },
    "weather": [
        {
            "time": <date-string>,
            "temperature": <number>
        },
        ...
    ]
}
```

### Example:

```json
{
    "position": {
        "lat": 44.8178131,
        "lon": 20.4568974
    },
    "weather": [
        {
            "time": "2025-08-25T12:00:00Z", // Temperature is for 12:00 UTC
            "temperature": 23.5
        },
        ...
    ]
}
```

_____________
# PLEASE NOTE

The temperature values are provided for 12:00 UTC (GMT+0), not for the local time of the specified location. For example, if you request weather for Belgrade, the temperature corresponds to 12:00 UTC (usually 14:00 local Belgrade time during summer).
