# Basic commands

**Build images and run containers:** `bash ./run.sh -a`

**Or if you wish only to test API without web-interface:** `bash ./run.sh`

**Web-interface is available here:** http://localhost:8888

**API is available here:** http://localhost:4444/api

**Cleanup:** `bash ./run.sh -c`
*(stop containers, remove containers, and remove images)*

_____
# API

### Check server status

**Method:** `GET`

**Endpoint:** `http://localhost:4444/status`

**Returns:** `{ "status": "ok", "version": "<COMMIT_HASH>" }`

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
            "time": "2025-08-25T12:00:00Z", // Temperature for 14:00 local time
            "temperature": 23.5
        },
        ...
    ]
}
```

_____________
# PLEASE NOTE

The temperature values are provided for 14:00 local time of the specified location; the time is returned as a UTC date string anyway.
