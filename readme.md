# Basic commands

```bash
# Build image
docker build --tag "weather:1.0.0" --file "./weather.dockerfile" .

# Run container
docker run --detach --name "forecast" --publish "4444:4000" weather:1.0.0

# Cleanup (stop container, remove container, and remove image)
docker stop "forecast"
docker rm "forecast"
docker rmi "weather:1.0.0"
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

**Default:** If both `lat` and `lon` are not provided, defaults to `lat=44.8125&lon=20.4612` (Belgrade). If one is provided, the second is required.

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

### Returns:

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
