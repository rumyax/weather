import { Router } from 'express';

import { getWeatherByLocation } from './getWeatherBy/location.js';
import { getWeatherByPosition } from './getWeatherBy/position.js';

const router = Router();

router.get('/getWeatherBy/location', getWeatherByLocation);
router.get('/getWeatherBy/position', getWeatherByPosition);

export default router;
